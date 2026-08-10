from django.shortcuts import get_object_or_404

from properties.models import PropertyStatusHistory


class PropertyStatusHistorySelector:

    @staticmethod
    def all():
        return PropertyStatusHistory.objects.select_related(
            "property",
            "changed_by",
        ).order_by("-created_at")

    @staticmethod
    def by_id(pk):
        return get_object_or_404(
            PropertyStatusHistory.objects.select_related("property", "changed_by"),
            pk=pk,
        )

    @staticmethod
    def by_property(property_id):
        return (
            PropertyStatusHistory.objects.select_related(
                "property",
                "changed_by",
            )
            .filter(property_id=property_id)
            .order_by("-created_at")
        )

    @staticmethod
    def latest(property_id):
        return (
            PropertyStatusHistory.objects.select_related(
                "property",
                "changed_by",
            )
            .filter(property_id=property_id)
            .order_by("-created_at")
            .first()
        )
