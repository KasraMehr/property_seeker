from rest_framework import serializers

from properties.models import Feature


class FeatureUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feature
        fields = (
            "title",
        )

    def validate_title(self, value):

        feature = self.instance

        if Feature.objects.exclude(pk=feature.pk).filter(title=value).exists():
            raise serializers.ValidationError(
                "این ویژگی قبلاً ثبت شده است."
            )

        return value