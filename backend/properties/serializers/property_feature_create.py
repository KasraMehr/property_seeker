from rest_framework import serializers

from properties.models import Feature, Property, PropertyFeature


class PropertyFeatureCreateSerializer(serializers.ModelSerializer):

    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())

    feature = serializers.PrimaryKeyRelatedField(
        queryset=Feature.objects.all()
    )  # ابجکت میفرسته

    class Meta:
        model = PropertyFeature
        fields = (
            "id",
            "property",
            "feature",
        )

    def validate(self, attrs):
        property_obj = attrs["property"]  # ابجکت انتخاب میکنه
        feature = attrs["feature"]

        if PropertyFeature.objects.filter(
            property=property_obj,
            feature=feature,
        ).exists():
            raise serializers.ValidationError(
                "این ویژگی قبلاً برای این ملک ثبت شده است."
            )

        return attrs
