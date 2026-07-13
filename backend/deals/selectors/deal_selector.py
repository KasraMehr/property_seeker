from django.db.models import Count, Sum, Q

from deals.models import Deal


class DealSelector:
    """
    All database queries related to Deal.
    No business logic should exist here.
    """

    @staticmethod
    def base_queryset():
        return (
            Deal.objects
            .select_related(
                "property",
                "listing",
                "agent",
                "customer",
            )
            .prefetch_related(
                "contracts",
            )
        )

    @staticmethod
    def all():
        return DealSelector.base_queryset()

    @staticmethod
    def by_id(pk):
        return DealSelector.base_queryset().get(pk=pk)

    @staticmethod
    def by_agent(agent_id):
        return (
            DealSelector.base_queryset()
            .filter(agent_id=agent_id)
        )

    @staticmethod
    def by_customer(customer_id):
        return (
            DealSelector.base_queryset()
            .filter(customer_id=customer_id)
        )

    @staticmethod
    def by_property(property_id):
        return (
            DealSelector.base_queryset()
            .filter(property_id=property_id)
        )

    @staticmethod
    def by_status(status):
        return (
            DealSelector.base_queryset()
            .filter(status=status)
        )

    @staticmethod
    def by_deal_type(deal_type):
        return (
            DealSelector.base_queryset()
            .filter(deal_type=deal_type)
        )

    @staticmethod
    def active():
        return (
            DealSelector.base_queryset()
            .exclude(status=Deal.Status.CANCELED)
        )

    @staticmethod
    def closed():
        return (
            DealSelector.base_queryset()
            .filter(status=Deal.Status.PAID)
        )

    @staticmethod
    def search(keyword):
        return (
            DealSelector.base_queryset()
            .filter(
                Q(customer__full_name__icontains=keyword)
                | Q(agent__full_name__icontains=keyword)
                | Q(property__title__icontains=keyword)
            )
        )

    @staticmethod
    def dashboard_statistics():
        queryset = Deal.objects.all()

        return {
            "total_deals": queryset.count(),
            "pending_deals": queryset.filter(
                status=Deal.Status.PENDING
            ).count(),
            "paid_deals": queryset.filter(
                status=Deal.Status.PAID
            ).count(),
            "canceled_deals": queryset.filter(
                status=Deal.Status.CANCELED
            ).count(),
            "total_sales": queryset.aggregate(
                total=Sum("price")
            )["total"]
            or 0,
        }