from rest_framework import serializers

from locations.models import Province


class ProvinceUpdateSerializer(serializers.ModelSerializer):

    name = serializers.CharField(
        required=False,
    )

    class Meta:
        model = Province
        fields = (
            "name",
        )

    def validate_name(self, value):

        province = self.instance

        if Province.objects.exclude(
            id=province.id
        ).filter(
            name=value
        ).exists():
            raise serializers.ValidationError(
                "این استان قبلاً ثبت شده است."
            )

        return value

    def update(self, instance, validated_data):

        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.save()

        return instance