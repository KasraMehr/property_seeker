import json
import threading
import uuid
from concurrent.futures import ThreadPoolExecutor
from contextlib import contextmanager
from datetime import datetime, timedelta
from unittest import skipUnless
from unittest.mock import patch
from zoneinfo import ZoneInfo

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import close_old_connections, connection
from django.test import SimpleTestCase, TestCase, TransactionTestCase, override_settings
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from accounts.models import Agency
from ingestion.models import (
    IngestionRun,
    IngestionRunItem,
    ListingSnapshot,
    ScrapeTarget,
)
from ingestion.providers.base import DiscoveredListing, ScrapedListing
from ingestion.providers.divar.parser import (
    extract_contact_phone,
    normalize_iran_mobile,
    normalize_iran_phone,
    parse_area_from_title,
    parse_listing_page,
)
from ingestion.providers.divar.provider import (
    DivarAuthenticationRequired,
    DivarContactChallengeRequired,
    DivarProvider,
)
from ingestion.services.persistence import (
    record_listing_removed,
    upsert_scraped_listing,
)
from ingestion.services.divar_session import (
    DivarSessionRequired,
    require_authenticated_session,
)
from ingestion.services.promotion import promote_listing
from ingestion.services.runs import (
    RunAlreadyActive,
    create_run,
    listing_refresh_due,
    populate_discovery_run,
    resume_run,
)
from ingestion.tasks import process_run_batch
from listing.models import Listing, Source
from properties.models import Owner


class DivarLoginApiTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_superuser(
            phone="09120000001",
            password="test-password",
            full_name="Test Operator",
            national_id="0012345678",
        )
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    @patch("ingestion.views.set_session_state")
    @patch("ingestion.views.authenticate_divar_session.delay")
    @patch("ingestion.views.create_attempt")
    def test_start_normalizes_phone_and_queues_worker(self, create, delay, set_state):
        attempt = {
            "id": "6fdd358d-b321-4baa-a843-b9991170d725",
            "status": "queued",
            "detail": "queued",
            "phone_masked": "0912***4567",
            "created_at": "now",
            "updated_at": "now",
        }
        create.return_value = attempt

        response = self.client.post(
            reverse("divar-login-start"),
            {"phone": "+98 912 123 4567"},
            format="json",
        )

        self.assertEqual(response.status_code, 202)
        create.assert_called_once_with("09121234567")
        delay.assert_called_once_with(attempt["id"], "09121234567")
        set_state.assert_called_once()

    @patch("ingestion.views.submit_otp")
    def test_confirm_forwards_valid_otp_without_persisting_it(self, submit):
        attempt_id = "6fdd358d-b321-4baa-a843-b9991170d725"
        submit.return_value = {
            "id": attempt_id,
            "status": "verifying",
            "detail": "verifying",
            "phone_masked": "0912***4567",
            "created_at": "now",
            "updated_at": "now",
        }

        response = self.client.post(
            reverse("divar-login-confirm", kwargs={"attempt_id": attempt_id}),
            {"otp": "123456"},
            format="json",
        )

        self.assertEqual(response.status_code, 202)
        submit.assert_called_once_with(uuid.UUID(attempt_id), "123456")
        self.assertNotContains(response, "123456", status_code=202)

    def test_start_rejects_invalid_mobile(self):
        response = self.client.post(
            reverse("divar-login-start"),
            {"phone": "02112345678"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    @patch("ingestion.views.get_session_state")
    def test_session_status_is_exposed_to_dashboard(self, get_state):
        get_state.return_value = {
            "status": "authenticated",
            "authenticated": True,
            "detail": "ready",
            "phone_masked": "0912***4567",
            "checked_at": "now",
        }
        response = self.client.get(reverse("divar-session-status"))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["authenticated"])


class DivarSessionGateTests(SimpleTestCase):
    @override_settings(DIVAR_REQUIRE_AUTHENTICATED_SESSION=True)
    @patch("ingestion.services.divar_session.get_session_state")
    def test_ingestion_is_blocked_without_authenticated_session(self, get_state):
        get_state.return_value = {
            "status": "unauthenticated",
            "authenticated": False,
        }
        with self.assertRaises(DivarSessionRequired):
            require_authenticated_session()

    @override_settings(DIVAR_REQUIRE_AUTHENTICATED_SESSION=True)
    @patch("ingestion.services.divar_session.get_session_state")
    def test_ingestion_is_allowed_with_authenticated_session(self, get_state):
        get_state.return_value = {
            "status": "authenticated",
            "authenticated": True,
        }
        self.assertTrue(require_authenticated_session()["authenticated"])


class DivarParserTests(SimpleTestCase):
    def test_contact_phone_is_normalized_without_reading_ad_description(self):
        self.assertEqual(normalize_iran_mobile("+98 912 123 4567"), "09121234567")
        self.assertEqual(normalize_iran_phone("+98 21 1234 5678"), "02112345678")
        self.assertEqual(
            extract_contact_phone(
                '<div role="dialog">شماره تماس: ۰۹۱۲ ۱۲۳ ۴۵۶۷</div>'
            ),
            "09121234567",
        )
        self.assertEqual(
            extract_contact_phone("<p>توضیحات آگهی 09121234567</p>"),
            "",
        )

    def test_area_title_fallback_requires_an_explicit_area_unit(self):
        self.assertEqual(parse_area_from_title("آپارتمان ۸۵متری دو خواب"), 85)
        self.assertEqual(parse_area_from_title("۱۲۰ متر مربع فاز دو"), 120)
        self.assertIsNone(parse_area_from_title("وام ۵۰۰ میلیونی"))
        self.assertIsNone(parse_area_from_title("۱۲۵۰ سوله و کارگاه"))

    def test_unhydrated_shell_is_not_considered_detail_ready(self):
        shell = """
        <html><h1 class="kt-page-title__title">SEO title</h1>
        <script>window.__PRELOADED_STATE__ = {"currentPost":{"post":{"sections":{}}}};</script>
        </html>
        """
        hydrated = shell.replace(
            "</html>",
            '<div class="kt-unexpandable-row">price</div></html>',
        )
        self.assertFalse(DivarProvider._detail_page_ready(shell))
        self.assertTrue(DivarProvider._detail_page_ready(hydrated))

    def test_parses_core_fields_and_keeps_publication_metadata_out_of_description(self):
        state = {
            "currentPost": {
                "post": {
                    "token": "test1234",
                    "title": "Structured title",
                    "sections": {
                        "LIST_DATA": [
                            {
                                "data": {
                                    "items": [
                                        {"title": "قیمت کل", "value": "۱۰٬۰۰۰ تومان"},
                                    ]
                                }
                            }
                        ],
                        "DESCRIPTION": [
                            {
                                "widgetType": "DESCRIPTION_ROW",
                                "data": {"text": "توضیح واقعی فروشنده"},
                            }
                        ],
                    },
                }
            }
        }
        html = (
            "<script>window.__PRELOADED_STATE__ = "
            + json.dumps(state, ensure_ascii=False)
            + ";</script>"
            + """
            <table class="kt-group-row">
              <thead><tr>
                <th><span class="kt-group-row-item__title">متراژ</span></th>
                <th><span class="kt-group-row-item__title">ساخت</span></th>
                <th><span class="kt-group-row-item__title">اتاق</span></th>
              </tr></thead>
              <tbody><tr>
                <td class="kt-group-row-item__value">۸۰</td>
                <td class="kt-group-row-item__value">۱۴۰۱</td>
                <td class="kt-group-row-item__value">۲</td>
              </tr></tbody>
            </table>
            <button class="kt-info-row">
              انتشار آگهی: ۶ مرداد ۱۴۰۵، ۱۱:۵۲
              آخرین به‌روز‌رسانی: ۸ مرداد ۱۴۰۵، ۰۹:۵۶
            </button>
            """
        )

        result = parse_listing_page(html, "https://divar.ir/v/test1234")

        self.assertIsNotNone(result)
        self.assertEqual(result.title, "Structured title")
        self.assertEqual(result.description, "توضیح واقعی فروشنده")
        self.assertNotIn("انتشار آگهی", result.description)
        self.assertEqual(result.total_price_toman, 10_000)
        self.assertEqual(result.area_m2, 80)
        self.assertEqual(result.build_year, 1401)
        self.assertEqual(result.room_count, 2)
        self.assertEqual(
            result.source_published_at,
            datetime(2026, 7, 28, 11, 52, tzinfo=ZoneInfo("Asia/Tehran")),
        )
        self.assertEqual(
            result.source_updated_at,
            datetime(2026, 7, 30, 9, 56, tzinfo=ZoneInfo("Asia/Tehran")),
        )

    def test_metadata_only_description_widget_is_rejected(self):
        state = {
            "currentPost": {
                "post": {
                    "token": "metadata1",
                    "title": "Listing",
                    "sections": {
                        "LIST_DATA": [{"data": {"title": "متراژ", "value": "۸۰"}}],
                        "DESCRIPTION": [
                            {
                                "widgetType": "DESCRIPTION_ROW",
                                "data": {"text": "انتشار آگهی: ۶ مرداد ۱۴۰۵، ۱۱:۵۲"},
                            }
                        ],
                    },
                }
            }
        }
        html = (
            "<script>window.__PRELOADED_STATE__ = "
            + json.dumps(state, ensure_ascii=False)
            + ";</script>"
        )
        result = parse_listing_page(html, "https://divar.ir/v/metadata1")
        self.assertEqual(result.description, "")


class DivarContactRevealTests(SimpleTestCase):
    class FakeElement:
        def __init__(self, driver, text=""):
            self.driver = driver
            self.text = text

        def is_displayed(self):
            return True

        def get_attribute(self, _name):
            return None

        def click(self):
            self.driver.revealed = True
            if self.driver.phone:
                self.driver.page_source = (
                    f'<div role="dialog">شماره تماس: {self.driver.phone}</div>'
                )

    class FakeDriver:
        def __init__(self, phone=""):
            self.phone = phone
            self.page_source = "<main>listing</main>"
            self.revealed = False
            self.button = DivarContactRevealTests.FakeElement(
                self, "اطلاعات تماس"
            )

        def find_elements(self, _by, selector):
            if selector == "button, a[role='button']":
                return [self.button]
            if self.revealed and not self.phone and "input[type='tel']" in selector:
                return [DivarContactRevealTests.FakeElement(self)]
            return []

        def execute_script(self, _script, element):
            element.click()

    def test_contact_button_reveal_returns_phone(self):
        provider = DivarProvider(phone_ingestion_enabled=True, contact_timeout=0.1)

        self.assertEqual(
            provider._fetch_phone_number(self.FakeDriver("09121234567")),
            "09121234567",
        )

    def test_listing_contact_action_wins_over_global_chat_link(self):
        provider = DivarProvider(phone_ingestion_enabled=True)
        driver = self.FakeDriver("09121234567")
        global_chat = self.FakeElement(driver, "چت و تماس")
        listing_contact = self.FakeElement(driver, "اطلاعات تماس")
        driver.find_elements = lambda _by, selector: (
            [global_chat, listing_contact]
            if selector == "button, a[role='button']"
            else []
        )

        self.assertIs(provider._contact_trigger(driver), listing_contact)

    def test_contact_button_reports_expired_login(self):
        provider = DivarProvider(phone_ingestion_enabled=True, contact_timeout=0.1)

        with self.assertRaises(DivarAuthenticationRequired):
            provider._fetch_phone_number(self.FakeDriver())

    def test_contact_button_reports_security_puzzle(self):
        provider = DivarProvider(phone_ingestion_enabled=True, contact_timeout=0.1)
        driver = self.FakeDriver()
        driver.page_source = "<div>\u0686\u0627\u0644\u0634 \u0632\u06cc\u0631 \u0631\u0627 \u062d\u0644 \u06a9\u0646\u06cc\u062f</div>"

        with self.assertRaises(DivarContactChallengeRequired):
            provider._fetch_phone_number(driver)


class IngestionPersistenceTests(TestCase):
    def setUp(self):
        self.source = Source.objects.create(name="Divar")
        self.target = ScrapeTarget.objects.create(
            source=self.source,
            name="Tehran sales",
            search_url="https://divar.ir/s/tehran/buy-residential",
        )

    def payload(self, **changes):
        values = {
            "external_id": "token-1",
            "url": "https://divar.ir/v/token-1",
            "title": "Apartment",
            "description": "Original description",
            "area_m2": 90,
            "build_year": 1400,
            "room_count": 2,
            "total_price_toman": 10_000_000_000,
        }
        values.update(changes)
        return ScrapedListing(**values)

    def test_upsert_is_idempotent_and_snapshots_only_changed_content(self):
        first = upsert_scraped_listing(payload=self.payload(), target=self.target)
        second = upsert_scraped_listing(payload=self.payload(), target=self.target)
        third = upsert_scraped_listing(
            payload=self.payload(description="Updated description"),
            target=self.target,
        )

        self.assertTrue(first.created)
        self.assertFalse(second.created)
        self.assertFalse(second.changed)
        self.assertTrue(third.changed)
        self.assertEqual(Listing.objects.count(), 1)
        self.assertEqual(ListingSnapshot.objects.count(), 2)
        self.assertEqual(
            ListingSnapshot.objects.first().changed_fields["description"]["old"],
            "Original description",
        )

    def test_upsert_preserves_phone_when_contact_reveal_is_temporarily_missing(self):
        first = upsert_scraped_listing(
            payload=self.payload(phone="09121234567"),
            target=self.target,
        )
        second = upsert_scraped_listing(
            payload=self.payload(phone=""),
            target=self.target,
        )

        second.listing.refresh_from_db()
        self.assertEqual(second.listing.contact_phone, "09121234567")
        self.assertEqual(second.listing.latest_payload["phone"], "09121234567")
        self.assertFalse(second.changed)
        self.assertEqual(ListingSnapshot.objects.count(), 1)
        self.assertTrue(first.created)

    def test_upsert_persists_divar_publication_timestamp(self):
        published_at = datetime(
            2026,
            7,
            28,
            11,
            52,
            tzinfo=ZoneInfo("Asia/Tehran"),
        )

        result = upsert_scraped_listing(
            payload=self.payload(source_published_at=published_at),
            target=self.target,
        )

        self.assertEqual(result.listing.published_at, published_at)
        self.assertEqual(
            result.listing.latest_payload["source_published_at"],
            published_at.isoformat(),
        )

    def test_two_confirmed_removals_six_hours_apart_expire_listing(self):
        listing = upsert_scraped_listing(
            payload=self.payload(), target=self.target
        ).listing
        first_check = timezone.now()
        record_listing_removed(listing=listing, checked_at=first_check)
        listing.refresh_from_db()
        self.assertEqual(listing.status, Listing.Status.ACTIVE)

        record_listing_removed(
            listing=listing,
            checked_at=first_check + timedelta(hours=5),
        )
        listing.refresh_from_db()
        self.assertEqual(listing.status, Listing.Status.ACTIVE)

        record_listing_removed(
            listing=listing,
            checked_at=first_check + timedelta(hours=6),
        )
        listing.refresh_from_db()
        self.assertEqual(listing.status, Listing.Status.EXPIRED)

    def test_promoted_property_is_not_changed_by_later_source_updates(self):
        listing = upsert_scraped_listing(
            payload=self.payload(), target=self.target
        ).listing
        agency = Agency.objects.create(name="Agency")
        actor = get_user_model().objects.create_user(
            phone="09120000000",
            password="test",
            full_name="Agent",
            national_id="001",
            agency=agency,
        )
        owner = Owner.objects.create(
            agency=agency,
            created_by=actor,
            full_name="Owner",
            phone="09121111111",
        )
        property_record = promote_listing(
            listing=listing,
            actor=actor,
            owner=owner,
            deal_type="sale",
        )

        upsert_scraped_listing(
            payload=self.payload(title="Source changed", area_m2=120),
            target=self.target,
        )
        property_record.refresh_from_db()
        listing.refresh_from_db()
        self.assertEqual(property_record.title, "Apartment")
        self.assertEqual(property_record.area, 90)
        self.assertEqual(listing.title, "Source changed")
        self.assertEqual(listing.listed_area, 120)

        with self.assertRaises(ValidationError):
            promote_listing(
                listing=listing,
                actor=actor,
                owner=owner,
                deal_type="sale",
            )

        property_record.delete()
        listing.refresh_from_db()
        self.assertIsNone(listing.property_id)


class RunPlanningTests(TestCase):
    def setUp(self):
        self.source = Source.objects.create(name="Divar")
        self.target = ScrapeTarget.objects.create(
            source=self.source,
            name="Target",
            search_url="https://divar.ir/s/tehran",
        )

    def test_target_has_only_one_queued_or_running_run(self):
        create_run(target=self.target, mode=IngestionRun.Mode.FULL)
        with self.assertRaises(RunAlreadyActive):
            create_run(target=self.target, mode=IngestionRun.Mode.DISCOVERY)

    def test_discovery_queues_new_and_card_changed_but_skips_fresh_known(self):
        known = upsert_scraped_listing(
            payload=ScrapedListing(
                external_id="known",
                url="https://divar.ir/v/known",
                title="Known",
                area_m2=80,
            ),
            target=self.target,
        ).listing
        known.last_checked_at = timezone.now()
        known.save(update_fields=["last_checked_at"])
        membership = known.target_memberships.get(target=self.target)
        membership.last_card_fingerprint = "same"
        membership.save(update_fields=["last_card_fingerprint"])
        run = create_run(target=self.target, mode=IngestionRun.Mode.DISCOVERY)

        populate_discovery_run(
            run=run,
            discovered=[
                DiscoveredListing("pinned-known", "https://divar.ir/v/pinned-known", 0),
                DiscoveredListing("known", "https://divar.ir/v/known", 1, "same"),
                DiscoveredListing(
                    "new-below-known", "https://divar.ir/v/new-below-known", 2
                ),
            ],
        )

        statuses = dict(run.items.values_list("external_id", "status"))
        self.assertEqual(statuses["known"], IngestionRunItem.Status.SKIPPED)
        self.assertEqual(statuses["pinned-known"], IngestionRunItem.Status.PENDING)
        self.assertEqual(statuses["new-below-known"], IngestionRunItem.Status.PENDING)

    def test_refresh_tiers_prioritize_shortlisted(self):
        listing = Listing.objects.create(
            source=self.source,
            external_id="shortlisted",
            url="https://divar.ir/v/shortlisted",
            title="Shortlisted",
            status=Listing.Status.ACTIVE,
            review_status=Listing.ReviewStatus.SHORTLISTED,
            last_checked_at=timezone.now() - timedelta(hours=3),
        )
        self.assertTrue(listing_refresh_due(listing))

    def test_interrupted_run_resumes_existing_items_without_duplicates(self):
        run = create_run(target=self.target, mode=IngestionRun.Mode.FULL)
        item = IngestionRunItem.objects.create(
            run=run,
            external_id="interrupted",
            url="https://divar.ir/v/interrupted",
            status=IngestionRunItem.Status.RUNNING,
            retry_count=3,
            started_at=timezone.now(),
        )
        run.status = IngestionRun.Status.FAILED
        run.save(update_fields=["status"])

        resume_run(run=run)

        item.refresh_from_db()
        self.assertEqual(item.status, IngestionRunItem.Status.PENDING)
        self.assertEqual(item.retry_count, 0)
        self.assertEqual(run.items.count(), 1)

    def test_transport_failures_retry_without_expiring_listing(self):
        listing = Listing.objects.create(
            source=self.source,
            external_id="timeout",
            url="https://divar.ir/v/timeout",
            title="Still active",
            status=Listing.Status.ACTIVE,
        )
        run = create_run(target=self.target, mode=IngestionRun.Mode.REFRESH)
        run.status = IngestionRun.Status.RUNNING
        run.save(update_fields=["status"])
        IngestionRunItem.objects.create(
            run=run,
            listing=listing,
            external_id=listing.external_id,
            url=listing.url,
        )

        class FakeLimiter:
            def block(self, _seconds):
                pass

        class FailingProvider:
            limiter = FakeLimiter()

            @contextmanager
            def session(self):
                yield object()

            def fetch_listing(self, _url, *, driver=None):
                from ingestion.providers.divar.provider import ProviderError

                raise ProviderError("timeout")

        with patch(
            "ingestion.tasks.create_divar_provider", return_value=FailingProvider()
        ):
            process_run_batch.run(str(run.pk), enqueue_next=False)

        listing.refresh_from_db()
        self.assertEqual(listing.status, Listing.Status.ACTIVE)
        self.assertIsNone(listing.removal_detected_at)


@skipUnless(connection.vendor == "postgresql", "PostgreSQL concurrency test")
class PostgreSQLConcurrencyTests(TransactionTestCase):
    reset_sequences = True

    def test_concurrent_upserts_create_one_listing_and_snapshot(self):
        source = Source.objects.create(name="Divar")
        target = ScrapeTarget.objects.create(
            source=source,
            name="Concurrent target",
            search_url="https://divar.ir/s/concurrent",
        )
        payload = ScrapedListing(
            external_id="same-token",
            url="https://divar.ir/v/same-token",
            title="Concurrent listing",
            area_m2=80,
        )
        barrier = threading.Barrier(2)

        def worker():
            close_old_connections()
            thread_target = ScrapeTarget.objects.select_related("source").get(
                pk=target.pk
            )
            barrier.wait(timeout=10)
            try:
                return upsert_scraped_listing(
                    payload=payload,
                    target=thread_target,
                ).listing.pk
            finally:
                close_old_connections()

        with ThreadPoolExecutor(max_workers=2) as executor:
            listing_ids = list(executor.map(lambda _index: worker(), range(2)))

        self.assertEqual(len(set(listing_ids)), 1)
        self.assertEqual(Listing.objects.count(), 1)
        self.assertEqual(ListingSnapshot.objects.count(), 1)
