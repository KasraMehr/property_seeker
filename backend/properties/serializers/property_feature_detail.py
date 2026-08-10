from rest_framework import serializers

from properties.models import PropertyFeature
from properties.serializers.feature_list import *
from properties.serializers.property_detail import *


class PropertyFeatureDetailSerializer(serializers.ModelSerializer):

    property_id = PropertyDetailSerializer(read_only=True)

    feature_id = FeatureListSerializer(read_only=True)

    class Meta:
        model = PropertyFeature
        fields = (
            "id",
            "property_id",
            "feature_id",
        )
