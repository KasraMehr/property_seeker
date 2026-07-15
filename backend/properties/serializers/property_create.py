from rest_framework import serializers

from ..models import Property


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
        validated_data["create_by"] = self.context["request"].user
        return Property.objects.create(**validated_data)