from rest_framework import serializers

from locations.models import District


class DistrictCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = District
        fields = (
            "name",
            "city",
        )

    def validate(self, attrs):

        name = attrs["name"].strip()
        city = attrs["city"]

        if District.objects.filter(
            city=city,
            name__iexact=name,
        ).exists():
            raise serializers.ValidationError(
                {"name": "این منطقه قبلاً در این شهر ثبت شده است."}
            )

        attrs["name"] = name
        return attrs
