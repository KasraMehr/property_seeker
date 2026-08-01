from rest_framework import serializers

from locations.models import District


class DistrictSerializer(serializers.ModelSerializer):

    city_name = serializers.CharField(
        source="city.name",
        read_only=True,
    )

    class Meta:
        model = District
        fields = (
            "id",
            "name",
            "city",
            "city_name",
        )
