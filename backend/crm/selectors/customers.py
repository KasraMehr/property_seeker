from crm.models import Customer


class CustomerSelector:

    @staticmethod
    def all(user):

        return (
            Customer.objects.filter(agency=user.agency, is_deleted=False)
            .select_related("agency", "assigned_agent")
            .order_by("-created_at")
        )

    @staticmethod
    def by_id(pk, user):

        return Customer.objects.select_related("agency", "assigned_agent").get(
            id=pk, agency=user.agency, is_deleted=False
        )
