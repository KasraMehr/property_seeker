from rest_framework import serializers

from locations.models import Province


class ProvinceDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Province
        fields = (
            "id",
            "name",
            "created_at",
        )