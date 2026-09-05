from django.test import TestCase

from ingestion.models import ScrapeTarget
from ingestion.services.targets import create_category_targets
from listing.models import Source
from locations.models import City, Zone


class ScrapeTargetCategoryTests(TestCase):

    def test_neighborhood_real_estate_url_preserves_scope_for_all_categories(self):
        city = City.objects.get(slug="fardis")

        zone = Zone.objects.get(
            id="fardis-vahdat",
        )

        source = Source.objects.create(
            name="Divar neighborhood",
        )

        targets = create_category_targets(
            source=source,
            name="Shahrak Vahdat",
            base_url="https://divar.ir/s/fardis/real-estate/shahrak-vahdat",
            zone=zone,
        )

        self.assertEqual(
            len(targets),
            len(ScrapeTarget.ListingCategory.choices),
        )

        self.assertEqual(
            {target.search_url for target in targets},
            {
                f"https://divar.ir/s/fardis/{category}/shahrak-vahdat"
                for category, _label in ScrapeTarget.ListingCategory.choices
            },
        )

        self.assertTrue(
            all(
                target.base_url
                == "https://divar.ir/s/fardis/real-estate/shahrak-vahdat"
                for target in targets
            )
        )