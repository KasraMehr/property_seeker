from crm.models import CustomerPreference


class CustomerPreferenceSelector:

    @staticmethod
    def all(user, customer_id=None):

        qs = CustomerPreference.objects.filter(customer__agency=user.agency)

        if customer_id:
            qs = qs.filter(customer_id=customer_id)

        return (
            qs.select_related("customer")
            .prefetch_related("neighborhoods")
            .order_by("-created_at")
        )

    @staticmethod
    def by_id(pk, user):

        return (
            CustomerPreference.objects.select_related("customer")
            .prefetch_related("neighborhoods")
            .get(id=pk, customer__agency=user.agency)
        )
