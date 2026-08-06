from rest_framework import serializers

from media.models import Media


class MediaDetailSerializer(serializers.ModelSerializer):

    property_code = serializers.CharField(
        source="property.property_code",
        read_only=True,
    )

    uploaded_by = serializers.StringRelatedField()

    class Meta:
        model = Media
        fields = (
            "id",
            "property",
            "property_code",
            "listing",
            "file",
            "file_name",
            "file_size",
            "mime_type",
            "media_type",
            "width",
            "height",
            "duration",
            "checksum",
            "alt_text",
            "is_main",
            "sort_order",
            "uploaded_by",
            "created_at",
            "updated_at",
        )