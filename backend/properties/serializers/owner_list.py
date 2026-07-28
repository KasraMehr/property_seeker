from rest_framework import serializers

from properties.models import Owner


class OwnerListSerializer(serializers.ModelSerializer):

    properties_count = serializers.IntegerField(
        read_only=True,
    )

    class Meta:
        model = Owner
        fields = (
            "id",
            "full_name",
            "phone",
            "properties_count",
            "created_by",
        )