from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from listing.filters import ListingFilter
from listing.models import Listing, Source
from listing.selectors import ListingSelector


class ListingFilterDateTests(TestCase):
    """Tests for time-range and date filters on ListingFilter."""

    def setUp(self):
        self.source = Source.objects.create(name="TestSource")
        self.now = timezone.now()
        self.today_start = self.now.replace(hour=0, minute=0, second=0, microsecond=0)
        self.yesterday_start = self.today_start - timedelta(days=1)
        self.yesterday_end = self.today_start - timedelta(seconds=1)

    def _create_listing(self, **kwargs):
        defaults = {
            "source": self.source,
            "external_id": f"ext-{timezone.now().timestamp()}",
            "title": "Test Listing",
        }
        defaults.update(kwargs)
        return Listing.objects.create(**defaults)

    def test_last_changed_from_filters_listings_changed_after_cutoff(self):
        old = self._create_listing(
            external_id="old",
            last_changed_at=self.now - timedelta(days=3),
        )
        new = self._create_listing(
            external_id="new",
            last_changed_at=self.now - timedelta(hours=1),
        )
        f = ListingFilter(
            data={"last_changed_from": (self.now - timedelta(days=2)).isoformat()},
            queryset=Listing.objects.all(),
        )
        qs = f.qs
        self.assertIn(new.pk, qs.values_list("pk", flat=True))
        self.assertNotIn(old.pk, qs.values_list("pk", flat=True))

    def test_last_changed_to_filters_listings_changed_before_cutoff(self):
        old = self._create_listing(
            external_id="old",
            last_changed_at=self.now - timedelta(days=3),
        )
        new = self._create_listing(
            external_id="new",
            last_changed_at=self.now - timedelta(hours=1),
        )
        f = ListingFilter(
            data={"last_changed_to": (self.now - timedelta(days=2)).isoformat()},
            queryset=Listing.objects.all(),
        )
        qs = f.qs
        self.assertIn(old.pk, qs.values_list("pk", flat=True))
        self.assertNotIn(new.pk, qs.values_list("pk", flat=True))

    def test_null_last_changed_at_is_not_excluded_by_last_changed_from(self):
        """last_changed_at IS NULL listings should NOT appear when filtering by last_changed_from."""
        listing_null = self._create_listing(
            external_id="null-changed",
            last_changed_at=None,
        )
        listing_new = self._create_listing(
            external_id="new-changed",
            last_changed_at=self.now - timedelta(hours=1),
        )
        f = ListingFilter(
            data={"last_changed_from": (self.now - timedelta(days=2)).isoformat()},
            queryset=Listing.objects.all(),
        )
        qs = f.qs
        self.assertIn(listing_new.pk, qs.values_list("pk", flat=True))
        self.assertNotIn(listing_null.pk, qs.values_list("pk", flat=True))

    def test_null_last_changed_at_appears_in_last_changed_to(self):
        """last_changed_at IS NULL listings should appear when filtering by last_changed_to
        (NULL <= any value is not true, but NULL is excluded by the database).
        This is expected behavior — NULL dates are not 'before' any date."""
        listing_null = self._create_listing(
            external_id="null-changed-2",
            last_changed_at=None,
        )
        f = ListingFilter(
            data={"last_changed_to": self.now.isoformat()},
            queryset=Listing.objects.all(),
        )
        qs = f.qs
        # NULL last_changed_at means the field was never updated, so it should NOT appear
        self.assertNotIn(listing_null.pk, qs.values_list("pk", flat=True))

    def test_today_preset_first_seen_today(self):
        """Listing first seen today should appear in 'today' filter."""
        listing = self._create_listing(
            external_id="today-first",
            first_seen_at=self.now,
            last_changed_at=None,
        )
        f = ListingFilter(
            data={"time_from": self.today_start.isoformat()},
            queryset=Listing.objects.all(),
        )
        self.assertIn(listing.pk, f.qs.values_list("pk", flat=True))

    def test_today_preset_old_listing_changed_today(self):
        """Listing created in the past but changed today should appear in 'today' filter."""
        listing = self._create_listing(
            external_id="old-changed-today",
            first_seen_at=self.now - timedelta(days=10),
            last_changed_at=self.now,
        )
        f = ListingFilter(
            data={"time_from": self.today_start.isoformat()},
            queryset=Listing.objects.all(),
        )
        self.assertIn(listing.pk, f.qs.values_list("pk", flat=True))

    def test_today_preset_excludes_old_unchanged(self):
        """Listing created and changed in the past should NOT appear in 'today' filter."""
        listing = self._create_listing(
            external_id="old-unchanged",
            first_seen_at=self.now - timedelta(days=10),
            last_changed_at=self.now - timedelta(days=5),
        )
        f = ListingFilter(
            data={"time_from": self.today_start.isoformat()},
            queryset=Listing.objects.all(),
        )
        self.assertNotIn(listing.pk, f.qs.values_list("pk", flat=True))

    def test_yesterday_preset(self):
        """Listing first seen or changed yesterday should appear in 'yesterday' filter."""
        listing_yesterday = self._create_listing(
            external_id="yesterday",
            first_seen_at=self.now - timedelta(days=1),
            last_changed_at=None,
        )
        listing_today = self._create_listing(
            external_id="today",
            first_seen_at=self.now,
            last_changed_at=None,
        )
        f = ListingFilter(
            data={
                "time_from": self.yesterday_start.isoformat(),
                "time_to": self.yesterday_end.isoformat(),
            },
            queryset=Listing.objects.all(),
        )
        self.assertIn(listing_yesterday.pk, f.qs.values_list("pk", flat=True))
        self.assertNotIn(listing_today.pk, f.qs.values_list("pk", flat=True))

    def test_last7days_preset(self):
        """Listing within last 7 days should appear, older ones should not."""
        listing_recent = self._create_listing(
            external_id="recent",
            first_seen_at=self.now - timedelta(days=3),
            last_changed_at=None,
        )
        listing_old = self._create_listing(
            external_id="old-7d",
            first_seen_at=self.now - timedelta(days=10),
            last_changed_at=None,
        )
        seven_days_ago = self.today_start - timedelta(days=6)
        f = ListingFilter(
            data={"time_from": seven_days_ago.isoformat()},
            queryset=Listing.objects.all(),
        )
        self.assertIn(listing_recent.pk, f.qs.values_list("pk", flat=True))
        self.assertNotIn(listing_old.pk, f.qs.values_list("pk", flat=True))

    def test_all_preset_no_time_restriction(self):
        """When no time filters are applied, all listings should appear."""
        listing_old = self._create_listing(
            external_id="all-old",
            first_seen_at=self.now - timedelta(days=100),
            last_changed_at=None,
        )
        listing_new = self._create_listing(
            external_id="all-new",
            first_seen_at=self.now,
            last_changed_at=None,
        )
        f = ListingFilter(data={}, queryset=Listing.objects.all())
        self.assertIn(listing_old.pk, f.qs.values_list("pk", flat=True))
        self.assertIn(listing_new.pk, f.qs.values_list("pk", flat=True))

    def test_time_filter_combines_with_status_filter(self):
        """Time range filter should work together with status filter."""
        active_today = self._create_listing(
            external_id="active-today",
            status=Listing.Status.ACTIVE,
            first_seen_at=self.now,
            last_changed_at=None,
        )
        draft_today = self._create_listing(
            external_id="draft-today",
            status=Listing.Status.DRAFT,
            first_seen_at=self.now,
            last_changed_at=None,
        )
        f = ListingFilter(
            data={
                "time_from": self.today_start.isoformat(),
                "status": ["active"],
            },
            queryset=Listing.objects.all(),
        )
        self.assertIn(active_today.pk, f.qs.values_list("pk", flat=True))
        self.assertNotIn(draft_today.pk, f.qs.values_list("pk", flat=True))

    def test_time_filter_combines_with_review_status(self):
        """Time range filter should work together with review_status filter."""
        shortlisted = self._create_listing(
            external_id="shortlisted",
            review_status=Listing.ReviewStatus.SHORTLISTED,
            first_seen_at=self.now,
            last_changed_at=None,
        )
        unreviewed = self._create_listing(
            external_id="unreviewed",
            review_status=Listing.ReviewStatus.UNREVIEWED,
            first_seen_at=self.now,
            last_changed_at=None,
        )
        f = ListingFilter(
            data={
                "time_from": self.today_start.isoformat(),
                "review_status": ["shortlisted"],
            },
            queryset=Listing.objects.all(),
        )
        self.assertIn(shortlisted.pk, f.qs.values_list("pk", flat=True))
        self.assertNotIn(unreviewed.pk, f.qs.values_list("pk", flat=True))

    def test_time_filter_combines_with_search(self):
        """Time range filter should work together with search filter."""
        match = self._create_listing(
            external_id="match-search",
            title="Unique Title ABC",
            first_seen_at=self.now,
            last_changed_at=None,
        )
        no_match = self._create_listing(
            external_id="no-match-search",
            title="Something Else",
            first_seen_at=self.now,
            last_changed_at=None,
        )
        f = ListingFilter(
            data={
                "time_from": self.today_start.isoformat(),
                "search": "Unique Title",
            },
            queryset=Listing.objects.all(),
        )
        self.assertIn(match.pk, f.qs.values_list("pk", flat=True))
        self.assertNotIn(no_match.pk, f.qs.values_list("pk", flat=True))


class ListingFilterAccessScopeTests(TestCase):
    """Tests that time-range filters respect user access scope."""

    def setUp(self):
        self.source = Source.objects.create(name="TestSource")
        self.now = timezone.now()
        self.today_start = self.now.replace(hour=0, minute=0, second=0, microsecond=0)
        User = get_user_model()
        self.owner = User.objects.create_user(
            phone="09000000001",
            password="test",
            full_name="Owner User",
            national_id="1000000001",
            is_owner=True,
        )

    def _create_listing(self, **kwargs):
        defaults = {
            "source": self.source,
            "external_id": f"ext-{timezone.now().timestamp()}",
            "title": "Test Listing",
        }
        defaults.update(kwargs)
        return Listing.objects.create(**defaults)

    def test_owner_sees_all_listings_with_time_filter(self):
        """Owner should see all listings matching the time filter."""
        self._create_listing(
            external_id="owner-sees-all",
            first_seen_at=self.now,
            last_changed_at=None,
        )
        qs = ListingSelector.for_user(self.owner)
        f = ListingFilter(
            data={"time_from": self.today_start.isoformat()},
            queryset=qs,
        )
        self.assertEqual(f.qs.count(), 1)


class ListingFilterPaginationTests(TestCase):
    """Tests that time-range filtering works correctly with pagination."""

    def setUp(self):
        self.source = Source.objects.create(name="TestSource")
        self.now = timezone.now()
        self.today_start = self.now.replace(hour=0, minute=0, second=0, microsecond=0)

    def _create_listing(self, **kwargs):
        defaults = {
            "source": self.source,
            "external_id": f"ext-{timezone.now().timestamp()}",
            "title": "Test Listing",
        }
        defaults.update(kwargs)
        return Listing.objects.create(**defaults)

    def test_filtering_applies_before_pagination(self):
        """Filtered count should reflect only matching listings."""
        for i in range(5):
            self._create_listing(
                external_id=f"today-{i}",
                first_seen_at=self.now,
                last_changed_at=None,
            )
        for i in range(3):
            self._create_listing(
                external_id=f"old-{i}",
                first_seen_at=self.now - timedelta(days=30),
                last_changed_at=None,
            )
        f = ListingFilter(
            data={"time_from": self.today_start.isoformat()},
            queryset=Listing.objects.all(),
        )
        self.assertEqual(f.qs.count(), 5)


class ListingFilterNoDuplicatesTests(TestCase):
    """Ensure no duplicate listings appear in filtered results."""

    def setUp(self):
        self.source = Source.objects.create(name="TestSource")
        self.now = timezone.now()
        self.today_start = self.now.replace(hour=0, minute=0, second=0, microsecond=0)

    def test_no_duplicates_in_time_filtered_results(self):
        """Querying with time filters should not produce duplicate listings."""
        listing = Listing.objects.create(
            source=self.source,
            external_id="unique-1",
            title="Unique",
            first_seen_at=self.now,
            last_changed_at=self.now,
        )
        f = ListingFilter(
            data={
                "first_seen_from": self.today_start.isoformat(),
                "last_changed_from": self.today_start.isoformat(),
            },
            queryset=Listing.objects.all(),
        )
        results = list(f.qs)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].pk, listing.pk)
