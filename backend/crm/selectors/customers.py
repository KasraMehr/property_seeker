from crm.models import Customer


class CustomerSelector:

    @staticmethod
    def all(user):

        qs = (
            Customer.objects.filter(agency=user.agency, is_deleted=False)
            .select_related("agency", "assigned_agent")
            .order_by("-created_at")
        )

        if not user.is_owner:
            qs = qs.filter(assigned_agent=user)

        return qs

    @staticmethod
    def by_id(pk, user):

        return Customer.objects.select_related("agency", "assigned_agent").get(
            id=pk, agency=user.agency, is_deleted=False
        )
