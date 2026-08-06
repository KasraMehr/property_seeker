from django.shortcuts import get_object_or_404

from deals.models import Deal


class DealSelector:


    @staticmethod
    def all(user):

        return (
            Deal.objects
            .filter(
                agency=user.agency,
                is_deleted=False,
            )
            .select_related(
                "property",
                "customer",
                "agent",
            )
            .order_by(
                "-created_at"
            )
        )



    @staticmethod
    def by_id(
        deal_id,
        user
    ):

        return get_object_or_404(

            Deal.objects
            .select_related(
                "property",
                "customer",
                "agent",
            )
            .filter(
                agency=user.agency,
                is_deleted=False,
            ),

            id=deal_id
        )



    @staticmethod
    def by_status(
        user,
        status
    ):

        return (
            Deal.objects
            .filter(
                agency=user.agency,
                status=status,
                is_deleted=False,
            )
        )



    @staticmethod
    def by_agent(
        user,
        agent_id
    ):

        return (
            Deal.objects
            .filter(
                agency=user.agency,
                agent_id=agent_id,
                is_deleted=False,
            )
        )