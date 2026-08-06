from rest_framework import serializers

from locations.models import City


class CityDetailSerializer(serializers.ModelSerializer):

    province = serializers.StringRelatedField()

    class Meta:
        model = City
        fields = (
            "id",
            "province",
            "name",
        )