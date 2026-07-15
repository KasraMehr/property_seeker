from rest_framework import serializers

from ..models import Owner


class OwnerDetailSerializer(serializers.ModelSerializer):

    properties_count = serializers.IntegerField(
        read_only=True
    )
    class Meta:
        model = Owner
        fields = (
            "id",
            "full_name",
            "phone",
            "alternate_phone",
            "national_id",
            "notes",
            "properties_count",
            "created_at",
            "updated_at",
        )