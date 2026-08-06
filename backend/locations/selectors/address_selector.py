from django.shortcuts import get_object_or_404

from locations.models import Address


class AddressSelector:

    @staticmethod
    def all(agency):
        return (
            Address.objects
            .filter(agency=agency)
            .select_related(
                "agency",
                "neighborhood",
                "neighborhood__district",
                "neighborhood__district__city",
                "neighborhood__district__city__province",
            )
            .order_by("-created_at")
        )

    @staticmethod
    def by_id(pk, agency):
        return get_object_or_404(
            Address.objects.select_related(
                "agency",
                "neighborhood",
                "neighborhood__district",
                "neighborhood__district__city",
                "neighborhood__district__city__province",
            ),
            pk=pk,
            agency=agency,
        )
