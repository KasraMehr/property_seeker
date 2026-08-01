from django.shortcuts import get_object_or_404

from locations.models import Province


class ProvinceSelector:

    @staticmethod
    def all():
        return (
            Province.objects
            .order_by("name")
        )

    @staticmethod
    def by_id(province_id):
        return get_object_or_404(
            Province,
            pk=province_id,
        )

    @staticmethod
    def by_name(name):
        return (
            Province.objects
            .filter(name=name)
            .first()
        )

    @staticmethod
    def search(query):
        return (
            Province.objects
            .filter(
                name__icontains=query
            )
            .order_by("name")
        )

    @staticmethod
    def detail(pk):
        return get_object_or_404(
            Province,
            pk=pk,
        )