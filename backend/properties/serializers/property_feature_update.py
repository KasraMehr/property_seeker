from rest_framework import serializers

from properties.models import PropertyFeature
from properties.models import Property
from properties.models import Feature


class PropertyFeatureUpdateSerializer(serializers.ModelSerializer):

    property = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(),
        required=False
    )

    feature = serializers.PrimaryKeyRelatedField(
        queryset=Feature.objects.all(),
        required=False
    )

    class Meta:
        model = PropertyFeature
        fields = (
            "property",
            "feature",
        )

    def validate(self, attrs):
        property_obj = attrs.get("property", self.instance.property)
        feature = attrs.get("feature", self.instance.feature)

        if PropertyFeature.objects.filter(
            property=property_obj,
            feature=feature,
        ).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError(
                "این ویژگی قبلاً برای این ملک ثبت شده است."
            )

        return attrs