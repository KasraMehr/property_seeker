from crm.models import CallLog


class CallLogSelector:

    @staticmethod
    def all(user):

        qs = (
            CallLog.objects.select_related(
                "customer",
                "property",
                "listing",
                "handled_by",
                "agency",
            )
            .filter(
                agency=user.agency,
                is_deleted=False,
            )
            .order_by("-called_at")
        )

        if not user.is_owner:
            qs = qs.filter(handled_by=user)

        return qs

    @staticmethod
    def by_id(pk, user):

        return CallLog.objects.select_related(
            "customer",
            "property",
            "listing",
            "handled_by",
            "agency",
        ).get(
            pk=pk,
            agency=user.agency,
        )
