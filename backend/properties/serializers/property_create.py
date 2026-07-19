from rest_framework import serializers

from properties.models import (
    Property,
    PropertyHistory,
)


class PropertyCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Property
        exclude = (
            "id",
            "property_code",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):

        user = self.context["request"].user

        validated_data["create_by"] = user

        property = Property.objects.create(**validated_data)

        PropertyHistory.objects.create(
            property=property,
            action=PropertyHistory.Action.CREATE,
            field_name="property",
            old_value="",
            new_value=property.property_code,
            changed_by=user,
        )

        return property