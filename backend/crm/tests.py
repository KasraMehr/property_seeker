from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from accounts.models import Agency, User
from crm.models import CallLog, Customer, CustomerPreference
from locations.models import City, District, Neighborhood, Province
from properties.models import Owner


class CallLogCreateOwnerResolutionTests(TestCase):

    def setUp(self):

        self.agency = Agency.objects.create(name="آژانس تست")

        self.agent_a = User.objects.create_user(
            phone="09120000001",
            password="testpass",
            agency=self.agency,
            full_name="کارشناس یک",
            national_id="1000000001",
        )

        self.agent_b = User.objects.create_user(
            phone="09120000002",
            password="testpass",
            agency=self.agency,
            full_name="کارشناس دو",
            national_id="1000000002",
        )

        self.owner = Owner.objects.create(
            agency=self.agency,
            created_by=self.agent_a,
            full_name="مالک نمونه",
            phone="09123456789",
        )

        self.client = APIClient()

    def _call_payload(self, **overrides):

        payload = {
            "call_type": "outgoing",
            "result": "answered",
            "called_at": timezone.now().isoformat(),
            "note": "",
        }
        payload.update(overrides)
        return payload

    def test_creates_landlord_customer_when_missing(self):

        self.client.force_authenticate(self.agent_a)

        response = self.client.post(
            "/api/calls/",
            self._call_payload(owner=self.owner.id),
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(CallLog.objects.count(), 1)

        customer = Customer.objects.get()
        self.assertEqual(customer.phone, self.owner.phone)
        self.assertEqual(customer.customer_type, "landlord")
        self.assertEqual(customer.source, "owner")
        self.assertEqual(CallLog.objects.get().customer, customer)

    def test_reuses_existing_landlord_customer_by_phone(self):

        existing = Customer.objects.create(
            agency=self.agency,
            full_name="مالک نمونه",
            phone=self.owner.phone,
            customer_type="landlord",
            status="new",
            source="owner",
            assigned_agent=self.agent_a,
        )

        # Different agent registers the call for the same owner — previously
        # this failed because the customer is not visible in that agent's
        # customer list, so a duplicate create hit the unique (agency, phone)
        # constraint.
        self.client.force_authenticate(self.agent_b)

        response = self.client.post(
            "/api/calls/",
            self._call_payload(owner=self.owner.id),
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Customer.objects.count(), 1)
        self.assertEqual(CallLog.objects.get().customer, existing)

    def test_reuses_customer_registered_with_other_type(self):

        existing = Customer.objects.create(
            agency=self.agency,
            full_name="مالک نمونه",
            phone=self.owner.phone,
            customer_type="buyer",
            status="new",
            assigned_agent=self.agent_a,
        )

        self.client.force_authenticate(self.agent_a)

        response = self.client.post(
            "/api/calls/",
            self._call_payload(owner=self.owner.id),
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Customer.objects.count(), 1)
        self.assertEqual(CallLog.objects.get().customer, existing)

    def test_revives_soft_deleted_customer_with_same_phone(self):

        existing = Customer.objects.create(
            agency=self.agency,
            full_name="مالک نمونه",
            phone=self.owner.phone,
            customer_type="landlord",
            status="new",
            is_deleted=True,
            assigned_agent=self.agent_a,
        )

        self.client.force_authenticate(self.agent_a)

        response = self.client.post(
            "/api/calls/",
            self._call_payload(owner=self.owner.id),
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        existing.refresh_from_db()
        self.assertFalse(existing.is_deleted)
        self.assertEqual(CallLog.objects.get().customer, existing)

    def test_customer_mode_still_works(self):

        customer = Customer.objects.create(
            agency=self.agency,
            full_name="مشتری نمونه",
            phone="09991234567",
            customer_type="buyer",
            status="new",
            assigned_agent=self.agent_a,
        )

        self.client.force_authenticate(self.agent_a)

        response = self.client.post(
            "/api/calls/",
            self._call_payload(customer=customer.id),
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(CallLog.objects.get().customer, customer)

    def test_requires_customer_or_owner(self):

        self.client.force_authenticate(self.agent_a)

        response = self.client.post(
            "/api/calls/",
            self._call_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(CallLog.objects.count(), 0)

    def test_owner_from_other_agency_rejected(self):

        other_agency = Agency.objects.create(name="آژانس دیگر")
        other_owner = Owner.objects.create(
            agency=other_agency,
            created_by=self.agent_a,
            full_name="مالک دیگر",
            phone="09129876543",
        )

        self.client.force_authenticate(self.agent_a)

        response = self.client.post(
            "/api/calls/",
            self._call_payload(owner=other_owner.id),
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(CallLog.objects.count(), 0)


class CustomerPreferenceEditTests(TestCase):

    def setUp(self):

        self.agency = Agency.objects.create(name="آژانس ترجیحات")

        self.owner_user = User.objects.create_user(
            phone="09120000011",
            password="testpass",
            agency=self.agency,
            full_name="مدیر آژانس",
            national_id="1000000011",
            is_owner=True,
        )

        self.customer = Customer.objects.create(
            agency=self.agency,
            full_name="مشتری ترجیحات",
            phone="09123456780",
            customer_type="buyer",
            status="new",
            assigned_agent=self.owner_user,
        )

        province = Province.objects.create(name="تهران")
        city = City.objects.create(province=province, name="تهران")
        district = District.objects.create(city=city, name="منطقه ۱")
        self.neighborhood = Neighborhood.objects.create(
            district=district, name="زعفرانیه"
        )

        self.preference = CustomerPreference.objects.create(
            customer=self.customer,
            deal_type="rent",
            property_type="آپارتمان",
            budget_min=1000000000,
            budget_max=3000000000,
            area_min=80,
            area_max=150,
            bedrooms=2,
            notes="نزدیک مترو باشد",
        )
        self.preference.neighborhoods.add(self.neighborhood)

        self.client = APIClient()
        self.client.force_authenticate(self.owner_user)

    def test_list_returns_all_editable_fields_for_autofill(self):

        response = self.client.get(
            "/api/customer-preferences/",
            {"customer_id": self.customer.id},
        )

        self.assertEqual(response.status_code, 200)

        data = response.json()[0]

        self.assertEqual(data["customer"], self.customer.id)
        self.assertEqual(data["deal_type"], "rent")
        self.assertEqual(data["property_type"], "آپارتمان")
        self.assertEqual(data["budget_min"], 1000000000)
        self.assertEqual(data["budget_max"], 3000000000)
        self.assertEqual(data["area_min"], 80)
        self.assertEqual(data["area_max"], 150)
        self.assertEqual(data["bedrooms"], 2)
        self.assertEqual(data["notes"], "نزدیک مترو باشد")
        self.assertEqual(
            data["neighborhoods"],
            [{"id": self.neighborhood.id, "name": "زعفرانیه"}],
        )

    def test_patch_updates_preference(self):

        response = self.client.patch(
            f"/api/customer-preferences/{self.preference.id}/",
            {
                "deal_type": "sale",
                "budget_min": 5000000000,
                "bedrooms": 3,
                "notes": "به روز شد",
                "neighborhoods": [],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)

        self.preference.refresh_from_db()

        self.assertEqual(self.preference.deal_type, "sale")
        self.assertEqual(self.preference.budget_min, 5000000000)
        self.assertEqual(self.preference.bedrooms, 3)
        self.assertEqual(self.preference.notes, "به روز شد")
        self.assertEqual(list(self.preference.neighborhoods.all()), [])

    def test_put_not_allowed(self):

        # The frontend previously sent PUT here — the view only implements
        # PATCH, so PUT must be rejected with 405.
        response = self.client.put(
            f"/api/customer-preferences/{self.preference.id}/",
            {"deal_type": "sale"},
            format="json",
        )

        self.assertEqual(response.status_code, 405)
