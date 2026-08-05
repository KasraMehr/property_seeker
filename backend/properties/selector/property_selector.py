from django.shortcuts import get_object_or_404

from ..models import Property


class PropertySelector:


    @staticmethod
    def all(user):

        queryset = (
            Property.objects
            .select_related(
                "owner",
                "agent",
                "address",
                "address__neighborhood",
            )
            .prefetch_related(
                "agent__service_neighborhoods"
            )
            .filter(
                agency=user.agency
            )
            .order_by("-created_at")
        )


        # اگر ایجنت باشد فقط ملک‌های خودش
        if not user.is_owner:

            queryset = queryset.filter(
                agent=user
            )


        return queryset



    @staticmethod
    def by_id(pk, user):

        queryset = (
            Property.objects
            .select_related(
                "owner",
                "agent",
                "address",
                "address__neighborhood",
            )
            .filter(
                agency=user.agency
            )
        )


        if not user.is_owner:

            queryset = queryset.filter(
                agent=user
            )


        return get_object_or_404(
            queryset,
            pk=pk
        )



    @staticmethod
    def by_owner(owner_id, user):

        return (
            Property.objects
            .select_related(
                "owner",
                "agent",
                "address",
                "address__neighborhood",
            )
            .filter(
                agency=user.agency,
                owner_id=owner_id
            )
            .order_by("-created_at")
        )



    @staticmethod
    def by_agent(agent_id, user):

        return (
            Property.objects
            .select_related(
                "owner",
                "agent",
                "address",
                "address__neighborhood",
            )
            .filter(
                agency=user.agency,
                agent_id=agent_id
            )
            .order_by("-created_at")
        )



    @staticmethod
    def by_neighborhood(neighborhood_id, user):

        return (
            Property.objects
            .select_related(
                "owner",
                "agent",
                "address",
                "address__neighborhood",
            )
            .filter(
                agency=user.agency,
                address__neighborhood_id=neighborhood_id
            )
            .order_by("-created_at")
        )



    @staticmethod
    def by_status(status, user):

        return (
            Property.objects
            .select_related(
                "owner",
                "agent",
                "address",
                "address__neighborhood",
            )
            .filter(
                agency=user.agency,
                status=status
            )
            .order_by("-created_at")
        )



    @staticmethod
    def search(query, user):

        return (
            Property.objects
            .select_related(
                "owner",
                "agent",
                "address",
                "address__neighborhood",
            )
            .filter(
                agency=user.agency
            )
            .filter(
                title__icontains=query
            )
            .order_by("-created_at")
        )