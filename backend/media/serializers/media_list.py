from rest_framework import serializers

from media.models import Media


class MediaListSerializer(serializers.ModelSerializer):

    property_code = serializers.CharField(
        source="property.property_code",
        read_only=True,
    )

    class Meta:
        model = Media
        fields = (
            "id",
            "property_code",
            "file",
            "media_type",
            "is_main",
            "sort_order",
            "created_at",
        )