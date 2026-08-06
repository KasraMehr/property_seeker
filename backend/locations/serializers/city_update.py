from rest_framework import serializers

from locations.models import (
    City,
    Province,
)


class CityUpdateSerializer(serializers.ModelSerializer):

    province = serializers.PrimaryKeyRelatedField(
        queryset=Province.objects.all(),
        required=False,
    )

    name = serializers.CharField(
        required=False,
    )

    class Meta:
        model = City
        fields = (
            "province",
            "name",
        )

    def validate(self, attrs):

        province = attrs.get(
            "province",
            self.instance.province,
        )

        name = attrs.get(
            "name",
            self.instance.name,
        )

        if City.objects.exclude(
            id=self.instance.id
        ).filter(
            province=province,
            name=name,
        ).exists():
            raise serializers.ValidationError(
                "این شهر قبلاً در این استان ثبت شده است."
            )

        return attrs

    def update(self, instance, validated_data):

        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.save()

        return instance