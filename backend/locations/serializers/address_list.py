from rest_framework import serializers

from locations.models import Address


class AddressSerializer(serializers.ModelSerializer):

    neighborhood_name = serializers.CharField(
        source="neighborhood.name",
        read_only=True,
    )

    district_name = serializers.CharField(
        source="neighborhood.district.name",
        read_only=True,
    )

    city_name = serializers.CharField(
        source="neighborhood.district.city.name",
        read_only=True,
    )

    province_name = serializers.CharField(
        source="neighborhood.district.city.province.name",
        read_only=True,
    )

    class Meta:
        model = Address
        fields = (
            "id",
            "neighborhood",
            "neighborhood_name",
            "district_name",
            "city_name",
            "province_name",
            "street",
            "alley",
            "plaque",
            "unit",
            "postal_code",
            "latitude",
            "longitude",
            "full_text",
            "created_at",
            "updated_at",
        )
