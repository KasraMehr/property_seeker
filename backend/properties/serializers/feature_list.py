from rest_framework import serializers

from properties.models import Feature


class FeatureListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feature
        fields = (
            "id",
            "title",
        )
