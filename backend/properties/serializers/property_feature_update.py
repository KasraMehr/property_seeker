from rest_framework import serializers

from properties.models import PropertyFeature, Property, Feature


class PropertyFeatureUpdateSerializer(serializers.ModelSerializer):

    property = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.none(),
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

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")
        if request:
            self.fields["property"].queryset = Property.objects.filter(
                agent=request.user
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