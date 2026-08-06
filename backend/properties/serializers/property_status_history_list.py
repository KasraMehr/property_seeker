from rest_framework import serializers

from properties.models import PropertyStatusHistory


class PropertyStatusHistoryListSerializer(serializers.ModelSerializer):

    property_code = serializers.CharField(
        source="property.property_code",
        read_only=True,
    )

    changed_by = serializers.CharField(
        source="changed_by.full_name",
        read_only=True,
    )

    class Meta:
        model = PropertyStatusHistory
        fields = (
            "id",
            "property_code",
            "old_status",
            "new_status",
            "changed_by",
            "created_at",
        )