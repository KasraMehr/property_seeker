from rest_framework import serializers

from properties.models import Feature


class FeatureCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feature
        fields = ("title",)

    def validate_title(self, value):

        if Feature.objects.filter(title=value).exists():
            raise serializers.ValidationError("این ویژگی قبلاً ثبت شده است.")

        return value
