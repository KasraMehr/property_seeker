from properties.models import Property


class PropertySelector:

    @staticmethod
    def all(user):
        qs = (
            Property.objects.select_related(
                "agency",
                "owner",
                "agent",
                "create_by",
                "address",
                "divar_neighborhood__zone",
                "divar_neighborhood__city",
            )
            .filter(agency=user.agency)
            .order_by("-created_at")
        )

        if not user.is_owner:
            qs = qs.filter(agent=user)

        return qs

    @staticmethod
    def by_id(pk, user):
        qs = Property.objects.select_related(
            "agency",
            "owner",
            "agent",
            "create_by",
            "address",
            "divar_neighborhood__zone",
            "divar_neighborhood__city",
        ).filter(
            pk=pk,
            agency=user.agency,
        )

        if not user.is_owner:
            qs = qs.filter(agent=user)

        return qs.get()
