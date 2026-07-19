from django.shortcuts import get_object_or_404

from properties.models import PropertyFeature


class PropertyFeatureSelector:

    @staticmethod
    def all():
        return (
            PropertyFeature.objects
            .select_related(
                "property",
                "feature",
            )
            .all()
        )

    @staticmethod
    def by_id(pk):
        return get_object_or_404(
            PropertyFeature.objects.select_related(
                "property",
                "feature",
            ),
            pk=pk,
        )

    @staticmethod
    def by_property(property_id):
        return (
            PropertyFeature.objects
            .select_related(
                "property",
                "feature",
            )
            .filter(property_id=property_id)
        )

    @staticmethod
    def by_feature(feature_id):
        return (
            PropertyFeature.objects
            .select_related(
                "property",
                "feature",
            )
            .filter(feature_id=feature_id)
        )