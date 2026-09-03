from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from locations.models import City, District, Province


class DistrictCreateTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            phone="09123456789",
            password="testpass123",
            full_name="تست",
            national_id="1234567890",
        )
        self.client.force_authenticate(user=self.user)

        self.province = Province.objects.create(name="تهران")
        self.city = City.objects.create(province=self.province, name="تهران")

    def test_create_district_returns_201(self):
        response = self.client.post(
            reverse("district-list-create"),
            {"name": "منطقه ۱", "city": self.city.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            District.objects.filter(name="منطقه ۱", city=self.city).exists()
        )

    def test_duplicate_district_name_in_same_city_rejected(self):
        District.objects.create(name="منطقه ۱", city=self.city)

        response = self.client.post(
            reverse("district-list-create"),
            {"name": "منطقه ۱", "city": self.city.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
