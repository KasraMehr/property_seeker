from rest_framework import serializers

from locations.models import City


class CityListSerializer(serializers.ModelSerializer):

    province = serializers.CharField(
        source="province.name",
        read_only=True,
    )

    class Meta:
        model = City
        fields = (
            "id",
            "name",
            "province",
        )
