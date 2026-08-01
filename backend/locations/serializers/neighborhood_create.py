from rest_framework import serializers

from locations.models import Neighborhood


class NeighborhoodCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Neighborhood
        fields = (
            "name",
            "district",
        )

    def validate(self, attrs):

        if Neighborhood.objects.filter(
            district=attrs["district"],
            name__iexact=attrs["name"],
        ).exists():

            raise serializers.ValidationError(
                {
                    "name": "این محله قبلاً در این منطقه ثبت شده است."
                }
            )

        return attrs