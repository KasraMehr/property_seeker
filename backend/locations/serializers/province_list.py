from rest_framework import serializers

from locations.models import Province


class ProvinceListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Province
        fields = (
            "id",
            "name",
        )
