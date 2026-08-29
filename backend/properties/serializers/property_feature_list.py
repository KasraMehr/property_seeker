from rest_framework import serializers

from properties.models import PropertyFeature


class PropertyFeatureListSerializer(serializers.ModelSerializer):

    property_code = serializers.CharField(
        source="property.property_code",
        read_only=True,
    )

    feature = serializers.CharField(
        source="feature.title",
        read_only=True,
    )

    feature_id = serializers.PrimaryKeyRelatedField(
        source="feature",
        read_only=True,
    )

    class Meta:
        model = PropertyFeature
        fields = (
            "id",
            "property_code",
            "feature",
            "feature_id",
        )
