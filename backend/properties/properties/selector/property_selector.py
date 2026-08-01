from urllib import request

from django.shortcuts import get_object_or_404

from ..models import Property


class PropertySelector:

    @staticmethod
    def all(agent):
        return (
            Property.objects
            .select_related(
                "owner",
                "agent",
                "address",
            )
            .filter(agent=agent)
            .order_by("-created_at")
        )

    @staticmethod
    def by_id(pk, agent):
        return get_object_or_404(
            Property.objects.select_related(
                "owner",
                "agent",
                "address",
            ),
            pk=pk,
            agent=agent,
        )

    @staticmethod
    def by_owner(owner_id):

        return (
            Property.objects
            .filter(owner_id=owner_id)
            .select_related(
                "owner",
                "agent",
                "address",
            )
            .order_by("-created_at")
        )

    @staticmethod
    def by_agent(agent_id):

        return (
            Property.objects
            .filter(agent_id=agent_id)
            .select_related(
                "owner",
                "agent",
                "address",
            )
            .order_by("-created_at")
        )

    @staticmethod
    def by_status(status):

        return (
            Property.objects
            .filter(status=status)
            .select_related(
                "owner",
                "agent",
                "address",
            )
            .order_by("-created_at")
        )

    @staticmethod
    def search(query):

        return (
            Property.objects.filter(
                title__icontains=query
            ) |
            Property.objects.filter(
                property_code__icontains=query
            )
        ).select_related(
            "owner",
            "agent",
            "address",
        ).distinct()