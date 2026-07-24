from django.shortcuts import get_object_or_404

from properties.models import PropertyFeature

class PropertyFeatureSelector:

    @staticmethod
    def all(user):
        return (
            PropertyFeature.objects
            .select_related(
                "property",
                "feature",
            )
            .filter(property__agent=user)
        )

    @staticmethod
    def by_id(pk, user):
        return get_object_or_404(
            PropertyFeature.objects.select_related(
                "property",
                "feature",
            ),
            pk=pk,
            property__agent=user,
        )

    @staticmethod
    def by_property(property_id, user):
        return (
            PropertyFeature.objects
            .select_related(
                "property",
                "feature",
            )
            .filter(
                property_id=property_id,
                property__agent=user,
            )
        )

    @staticmethod
    def by_feature(feature_id, user):
        return (
            PropertyFeature.objects
            .select_related(
                "property",
                "feature",
            )
            .filter(
                feature_id=feature_id,
                property__agent=user,
            )
        )