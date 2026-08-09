from django.shortcuts import get_object_or_404

from locations.models import City


class CitySelector:

    @staticmethod
    def all():
        return City.objects.select_related("province").order_by(
            "province__name", "name"
        )

    @staticmethod
    def by_id(city_id):
        return get_object_or_404(
            City.objects.select_related("province"),
            pk=city_id,
        )

    @staticmethod
    def detail(pk):
        return get_object_or_404(
            City.objects.select_related("province"),
            pk=pk,
        )

    @staticmethod
    def search(query):
        return City.objects.select_related("province").filter(name__icontains=query)
