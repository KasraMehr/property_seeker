from rest_framework import serializers

from locations.models import Neighborhood


class NeighborhoodSerializer(serializers.ModelSerializer):

    district_name = serializers.CharField(
        source="district.name",
        read_only=True,
    )

    city_name = serializers.CharField(
        source="district.city.name",
        read_only=True,
    )

    class Meta:
        model = Neighborhood
        fields = (
            "id",
            "name",
            "district",
            "district_name",
            "city_name",
        )
