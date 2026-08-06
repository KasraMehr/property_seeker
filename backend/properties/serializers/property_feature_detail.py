from rest_framework import serializers

from properties.models import PropertyFeature


class PropertyFeatureDetailSerializer(serializers.ModelSerializer):

    property_id = serializers.IntegerField(
        source="property.id",
        read_only=True,
    )

    property_code = serializers.CharField(
        source="property.property_code",
        read_only=True,
    )

    feature_id = serializers.IntegerField(
        source="feature.id",
        read_only=True,
    )

    feature_title = serializers.CharField(
        source="feature.title",
        read_only=True,
    )

    class Meta:
        model = PropertyFeature
        fields = (
            "id",
            "property_id",
            "property_code",
            "feature_id",
            "feature_title",
        )