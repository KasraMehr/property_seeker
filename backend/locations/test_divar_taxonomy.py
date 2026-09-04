from django.test import TestCase

from locations.models import City, DivarNeighborhood, Province, Zone
from locations.services import sync_divar_neighborhoods


class DivarTaxonomyTests(TestCase):
    def setUp(self):
        province = Province.objects.create(name="Test province")
        self.city = City.objects.create(
            province=province, name="Test city", slug="test-city"
        )
        self.zone = Zone.objects.create(
            id="test-zone", city=self.city, name="Test zone"
        )

    def test_sync_normalizes_identity_and_preserves_admin_mapping(self):
        mapped = DivarNeighborhood.objects.create(
            city=self.city,
            zone=self.zone,
            name="علی",
            normalized_name="ignored-on-save",
        )
        stale = DivarNeighborhood.objects.create(
            city=self.city,
            name="قدیمی",
            normalized_name="ignored-on-save",
        )

        result = sync_divar_neighborhoods(
            "test-city", fetcher=lambda _slug: ["علي", "جدید"]
        )

        mapped.refresh_from_db()
        stale.refresh_from_db()
        new_item = DivarNeighborhood.objects.get(normalized_name="جدید")
        self.assertEqual(mapped.zone, self.zone)
        self.assertEqual(mapped.name, "علي")
        self.assertTrue(mapped.active)
        self.assertFalse(stale.active)
        self.assertIsNone(new_item.zone)
        self.assertEqual(result["created_count"], 1)
        self.assertEqual(result["deactivated_count"], 1)

    def test_fardis_seed_contains_seven_logical_zones(self):
        self.assertEqual(Zone.objects.filter(city__slug="fardis").count(), 7)
        self.assertTrue(
            DivarNeighborhood.objects.filter(
                city__slug="fardis",
                name="قریشی",
                zone_id="fardis-ghoreishi",
            ).exists()
        )
