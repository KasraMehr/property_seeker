from rest_framework import serializers

from locations.models import Province


class ProvinceCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Province
        fields = (
            "name",
        )

    def validate_name(self, value):

        if Province.objects.filter(name=value).exists():
            raise serializers.ValidationError(
                "این استان قبلاً ثبت شده است."
            )

        return value