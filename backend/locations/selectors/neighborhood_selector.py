from django.shortcuts import get_object_or_404

from locations.models import Neighborhood


class NeighborhoodSelector:

    @staticmethod
    def all():
        return (
            Neighborhood.objects
            .select_related(
                "district",
                "district__city",
            )
            .order_by("district__name", "name")
        )

    @staticmethod
    def by_id(pk):
        return get_object_or_404(
            Neighborhood.objects.select_related(
                "district",
                "district__city",
            ),
            pk=pk,
        )