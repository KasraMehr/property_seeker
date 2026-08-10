from rest_framework import serializers

from ..models import Media


class MediaCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Media
        fields = (
            "property",
            "listing",
            "file",
            "media_type",
            "is_main",
            "sort_order",
            "alt_text",
        )

    def validate(self, attrs):

        file = attrs.get("file")

        if not file:
            raise serializers.ValidationError(
                {
                    "file": "فایل الزامی است."
                }
            )

        return attrs