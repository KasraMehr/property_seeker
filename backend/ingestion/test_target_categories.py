from django.test import TestCase

from ingestion.models import ScrapeTarget
from ingestion.services.targets import create_category_targets
from listing.models import Source
from locations.models import City, Province, Zone


class ScrapeTargetCategoryTests(TestCase):
    def test_one_base_url_creates_all_four_category_targets(self):
        province = Province.objects.create(name="Target test province")
        city = City.objects.create(
            province=province, name="Target test city", slug="target-test-city"
        )
        zone = Zone.objects.create(
            id="target-test-zone", city=city, name="Target test zone"
        )
        source = Source.objects.create(name="Divar")

        targets = create_category_targets(
            source=source,
            name="My location",
            base_url="https://divar.ir/s/target-test-city?districts=123",
            zone=zone,
        )

        self.assertEqual(len(targets), 4)
        self.assertEqual(
            {target.listing_category for target in targets},
            {value for value, _label in ScrapeTarget.ListingCategory.choices},
        )
        self.assertTrue(
            all("?districts=123" in target.search_url for target in targets)
        )
        self.assertEqual(
            targets[0].base_url,
            "https://divar.ir/s/target-test-city?districts=123",
        )
