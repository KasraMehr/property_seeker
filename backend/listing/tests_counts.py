from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from listing.models import Listing, Source


class ListingCountsViewTests(TestCase):
    """Tests for the ListingCountsView endpoint.

    Verifies that badge counts reflect the currently active filters.
    """

    def setUp(self):
        self.source = Source.objects.create(name="TestSource")
        self.now = __import__("django.utils.timezone", fromlist=["now"]).now()
        self.today_start = self.now.replace(hour=0, minute=0, second=0, microsecond=0)

        User = get_user_model()
        self.owner = User.objects.create_user(
            phone="09000000001",
            password="test",
            full_name="Owner User",
            national_id="1000000001",
            is_owner=True,
        )
        self.client = APIClient()
        self.client.force_authenticate(self.owner)
        self.url = reverse("listing-counts")

    def _create_listing(self, **kwargs):
        defaults = {
            "source": self.source,
            "external_id": f"ext-{__import__('time').time()}",
            "title": "Test Listing",
        }
        defaults.update(kwargs)
        return Listing.objects.create(**defaults)

    # ── Baseline counts ──────────────────────────────────────────

    def test_empty_db_returns_all_zeros(self):
        """No listings → all counts should be 0."""
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["all"], 0)
        self.assertEqual(res.data["agency"], 0)
        self.assertEqual(res.data["owner"], 0)
        self.assertEqual(res.data["pending"], 0)

    def test_counts_split_by_advertiser_type(self):
        """Counts should split correctly by advertiser_type."""
        self._create_listing(
            external_id="agency-1",
            advertiser_type=Listing.AdvertiserType.AGENCY,
            advertiser_classification_status=Listing.AdvertiserClassificationStatus.SUCCEEDED,
        )
        self._create_listing(
            external_id="agency-2",
            advertiser_type=Listing.AdvertiserType.AGENCY,
            advertiser_classification_status=Listing.AdvertiserClassificationStatus.SUCCEEDED,
        )
        self._create_listing(
            external_id="owner-1",
            advertiser_type=Listing.AdvertiserType.OWNER,
            advertiser_classification_status=Listing.AdvertiserClassificationStatus.SUCCEEDED,
        )
        self._create_listing(
            external_id="pending-1",
            advertiser_type=None,
            advertiser_classification_status=Listing.AdvertiserClassificationStatus.PENDING,
        )

        res = self.client.get(self.url)
        self.assertEqual(res.data["all"], 4)
        self.assertEqual(res.data["agency"], 2)
        self.assertEqual(res.data["owner"], 1)
        self.assertEqual(res.data["pending"], 1)

    # ── Filter params change counts ──────────────────────────────

    def test_search_filter_reduces_counts(self):
        """Passing search param should only count matching listings."""
        self._create_listing(external_id="alpha", title="Unique Alpha")
        self._create_listing(external_id="beta", title="Something Beta")
        self._create_listing(external_id="gamma", title="Another Gamma")

        res = self.client.get(self.url, {"search": "Alpha"})
        self.assertEqual(res.data["all"], 1)

    def test_status_filter_reduces_counts(self):
        """Passing status param should only count matching listings."""
        self._create_listing(external_id="active-1", status=Listing.Status.ACTIVE)
        self._create_listing(external_id="active-2", status=Listing.Status.ACTIVE)
        self._create_listing(external_id="draft-1", status=Listing.Status.DRAFT)

        res = self.client.get(self.url, {"status": "active"})
        self.assertEqual(res.data["all"], 2)

    def test_review_status_filter_reduces_counts(self):
        """Passing review_status param should only count matching listings."""
        self._create_listing(
            external_id="short-1",
            review_status=Listing.ReviewStatus.SHORTLISTED,
        )
        self._create_listing(
            external_id="unreviewed-1",
            review_status=Listing.ReviewStatus.UNREVIEWED,
        )

        res = self.client.get(self.url, {"review_status": "shortlisted"})
        self.assertEqual(res.data["all"], 1)

    def test_published_at_filter_reduces_counts(self):
        """published_at_from should only count listings published after cutoff."""
        self._create_listing(
            external_id="today-pub",
            published_at=self.now,
        )
        self._create_listing(
            external_id="old-pub",
            published_at=self.now - timedelta(days=10),
        )

        res = self.client.get(self.url, {
            "published_at_from": self.today_start.isoformat(),
        })
        self.assertEqual(res.data["all"], 1)

    def test_freshness_new_filter_reduces_counts(self):
        """freshness=new should only count listings created AND published within 24h."""
        self._create_listing(
            external_id="fresh",
            published_at=self.now,
            created_at=self.now,
        )
        self._create_listing(
            external_id="old",
            published_at=self.now - timedelta(days=5),
            created_at=self.now - timedelta(days=5),
        )

        res = self.client.get(self.url, {"freshness": "new"})
        self.assertEqual(res.data["all"], 1)

    def test_freshness_updated_filter_reduces_counts(self):
        """freshness=updated should count listings changed within 24h but NOT new."""
        self._create_listing(
            external_id="new-listing",
            published_at=self.now,
            created_at=self.now,
        )
        self._create_listing(
            external_id="updated-listing",
            published_at=self.now - timedelta(days=5),
            created_at=self.now - timedelta(days=5),
            last_changed_at=self.now,
        )
        self._create_listing(
            external_id="old-listing",
            published_at=self.now - timedelta(days=10),
            created_at=self.now - timedelta(days=10),
            last_changed_at=self.now - timedelta(days=10),
        )

        res = self.client.get(self.url, {"freshness": "updated"})
        self.assertEqual(res.data["all"], 1)

    def test_freshness_all_returns_everything(self):
        """freshness=all should not filter anything."""
        self._create_listing(
            external_id="a",
            published_at=self.now,
            created_at=self.now,
        )
        self._create_listing(
            external_id="b",
            published_at=self.now - timedelta(days=5),
            created_at=self.now - timedelta(days=5),
        )

        res = self.client.get(self.url, {"freshness": "all"})
        self.assertEqual(res.data["all"], 2)

    def test_combined_filters_narrow_counts(self):
        """Multiple filters together should further narrow counts."""
        self._create_listing(
            external_id="match-both",
            title="Alpha Special",
            status=Listing.Status.ACTIVE,
            published_at=self.now,
        )
        self._create_listing(
            external_id="match-title-only",
            title="Alpha Other",
            status=Listing.Status.DRAFT,
            published_at=self.now,
        )
        self._create_listing(
            external_id="match-status-only",
            title="Beta Special",
            status=Listing.Status.ACTIVE,
            published_at=self.now - timedelta(days=10),
        )

        res = self.client.get(self.url, {
            "search": "Alpha",
            "status": "active",
        })
        self.assertEqual(res.data["all"], 1)

    # ── advertiser_type is stripped (not used as a filter) ────────

    def test_advertiser_type_param_is_ignored(self):
        """advertiser_type in query params should NOT restrict the base queryset.

        Counts should split by type regardless of what advertiser_type is passed.
        """
        self._create_listing(
            external_id="agency-1",
            advertiser_type=Listing.AdvertiserType.AGENCY,
            advertiser_classification_status=Listing.AdvertiserClassificationStatus.SUCCEEDED,
        )
        self._create_listing(
            external_id="owner-1",
            advertiser_type=Listing.AdvertiserType.OWNER,
            advertiser_classification_status=Listing.AdvertiserClassificationStatus.SUCCEEDED,
        )

        # Pass agency as query param — should still count both tabs correctly
        res = self.client.get(self.url, {"advertiser_type": "agency"})
        self.assertEqual(res.data["all"], 2)
        self.assertEqual(res.data["agency"], 1)
        self.assertEqual(res.data["owner"], 1)

    # ── Counts reflect tab-level split after filtering ────────────

    def test_filtered_counts_split_correctly_across_tabs(self):
        """Filters apply before the tab split, so all tabs see filtered totals."""
        # 3 active agency listings
        for i in range(3):
            self._create_listing(
                external_id=f"agency-active-{i}",
                status=Listing.Status.ACTIVE,
                advertiser_type=Listing.AdvertiserType.AGENCY,
                advertiser_classification_status=Listing.AdvertiserClassificationStatus.SUCCEEDED,
            )
        # 2 active owner listings
        for i in range(2):
            self._create_listing(
                external_id=f"owner-active-{i}",
                status=Listing.Status.ACTIVE,
                advertiser_type=Listing.AdvertiserType.OWNER,
                advertiser_classification_status=Listing.AdvertiserClassificationStatus.SUCCEEDED,
            )
        # 1 draft agency listing (should be excluded by status filter)
        self._create_listing(
            external_id="agency-draft",
            status=Listing.Status.DRAFT,
            advertiser_type=Listing.AdvertiserType.AGENCY,
            advertiser_classification_status=Listing.AdvertiserClassificationStatus.SUCCEEDED,
        )

        res = self.client.get(self.url, {"status": "active"})
        self.assertEqual(res.data["all"], 5)
        self.assertEqual(res.data["agency"], 3)
        self.assertEqual(res.data["owner"], 2)
        self.assertEqual(res.data["pending"], 0)

    # ── Price range filters ───────────────────────────────────────

    def test_price_range_filter_reduces_counts(self):
        """listed_sale_price range should narrow counts."""
        self._create_listing(external_id="cheap", listed_sale_price=500_000_000)
        self._create_listing(external_id="expensive", listed_sale_price=5_000_000_000)
        self._create_listing(external_id="mid", listed_sale_price=2_000_000_000)

        res = self.client.get(self.url, {
            "listed_sale_price_min": 1_000_000_000,
            "listed_sale_price_max": 3_000_000_000,
        })
        self.assertEqual(res.data["all"], 1)

    # ── time_from / time_to presets ───────────────────────────────

    def test_time_from_preset_reduces_counts(self):
        """time_from should only count listings seen or changed after cutoff."""
        self._create_listing(
            external_id="recent",
            first_seen_at=self.now,
            last_changed_at=None,
        )
        self._create_listing(
            external_id="old",
            first_seen_at=self.now - timedelta(days=10),
            last_changed_at=None,
        )

        res = self.client.get(self.url, {
            "time_from": self.today_start.isoformat(),
        })
        self.assertEqual(res.data["all"], 1)
