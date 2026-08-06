from rest_framework import serializers

from media.models import Media


class MediaUpdateSerializer(serializers.ModelSerializer):

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

        extra_kwargs = {
            "property": {"required": False},
            "listing": {"required": False},
            "file": {"required": False},
            "media_type": {"required": False},
            "is_main": {"required": False},
            "sort_order": {"required": False},
            "alt_text": {
                "required": False,
                "allow_blank": True,
            },
        }