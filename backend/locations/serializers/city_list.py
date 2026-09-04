from rest_framework import serializers

from locations.models import City


class CityListSerializer(serializers.ModelSerializer):

    province = serializers.CharField(
        source="province.name",
        read_only=True,
    )

    province_id = serializers.PrimaryKeyRelatedField(
        source="province",
        read_only=True,
    )

    class Meta:
        model = City
        fields = (
            "id",
            "name",
            "slug",
            "province",
            "province_id",
        )
