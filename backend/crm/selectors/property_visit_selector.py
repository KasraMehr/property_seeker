from django.shortcuts import get_object_or_404

from ..models import PropertyVisit


class PropertyVisitSelector:

    @staticmethod
    def all(user):

        return (
            PropertyVisit.objects.select_related(
                "property",
                "customer",
                "agent",
            )
            .filter(agency=user.agency)
            .order_by("-visit_date")
        )

    @staticmethod
    def by_id(pk, user):

        return get_object_or_404(
            PropertyVisit.objects.select_related(
                "property",
                "customer",
                "agent",
            ),
            id=pk,
            agency=user.agency,
        )

    @staticmethod
    def by_agent(agent_id, user):

        return PropertyVisit.objects.filter(
            agency=user.agency, agent_id=agent_id
        ).select_related("property", "customer", "agent")

    @staticmethod
    def by_status(status, user):

        return PropertyVisit.objects.filter(agency=user.agency, status=status)
