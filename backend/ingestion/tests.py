import json
from contextlib import contextmanager
from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta
import threading
from unittest import skipUnless
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import close_old_connections, connection
from django.test import SimpleTestCase, TestCase, TransactionTestCase
from django.utils import timezone

from accounts.models import Agency
from ingestion.models import IngestionRun, IngestionRunItem, ListingSnapshot, ScrapeTarget
from ingestion.providers.base import DiscoveredListing, ScrapedListing
from ingestion.providers.divar.parser import parse_area_from_title, parse_listing_page
from ingestion.providers.divar.provider import DivarProvider
from ingestion.services.persistence import record_listing_removed, upsert_scraped_listing
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


class DivarParserTests(SimpleTestCase):
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
            '<script>window.__PRELOADED_STATE__ = '
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
        self.assertIsNotNone(result.source_published_at)
        self.assertIsNotNone(result.source_updated_at)

    def test_metadata_only_description_widget_is_rejected(self):
        state = {
            "currentPost": {
                "post": {
                    "token": "metadata1",
                    "title": "Listing",
                    "sections": {
                        "LIST_DATA": [{"data": {"title": "متراژ", "value": "۸۰"}}],
                        "DESCRIPTION": [{
                            "widgetType": "DESCRIPTION_ROW",
                            "data": {"text": "انتشار آگهی: ۶ مرداد ۱۴۰۵، ۱۱:۵۲"},
                        }],
                    },
                }
            }
        }
        html = '<script>window.__PRELOADED_STATE__ = ' + json.dumps(state, ensure_ascii=False) + ";</script>"
        result = parse_listing_page(html, "https://divar.ir/v/metadata1")
        self.assertEqual(result.description, "")


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

    def test_two_confirmed_removals_six_hours_apart_expire_listing(self):
        listing = upsert_scraped_listing(payload=self.payload(), target=self.target).listing
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
        listing = upsert_scraped_listing(payload=self.payload(), target=self.target).listing
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
                DiscoveredListing("new-below-known", "https://divar.ir/v/new-below-known", 2),
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

        with patch("ingestion.tasks.create_divar_provider", return_value=FailingProvider()):
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
            thread_target = ScrapeTarget.objects.select_related("source").get(pk=target.pk)
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
