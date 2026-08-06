from django.shortcuts import get_object_or_404

from locations.models import District


class DistrictSelector:

    @staticmethod
    def all():
        return (
            District.objects
            .select_related("city")
            .order_by("name")
        )

    @staticmethod
    def by_id(pk):
        return get_object_or_404(
            District.objects.select_related("city"),
            pk=pk,
        )