from django.shortcuts import get_object_or_404

from properties.models import Feature


class FeatureSelector:

    @staticmethod
    def all():

        return Feature.objects.order_by("title")

    @staticmethod
    def by_id(pk):

        return get_object_or_404(
            Feature,
            pk=pk,
        )

    @staticmethod
    def search(query):

        return Feature.objects.filter(
            title__icontains=query
        )