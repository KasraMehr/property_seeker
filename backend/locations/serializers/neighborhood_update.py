from rest_framework import serializers

from locations.models import Neighborhood


class NeighborhoodUpdateSerializer(serializers.ModelSerializer):

    name = serializers.CharField(
        required=False,
    )

    district = serializers.PrimaryKeyRelatedField(
        queryset=Neighborhood._meta.get_field(
            "district"
        ).remote_field.model.objects.all(),
        required=False,
    )

    class Meta:
        model = Neighborhood
        fields = (
            "name",
            "district",
        )

    def validate(self, attrs):

        instance = self.instance

        name = attrs.get("name", instance.name)
        district = attrs.get("district", instance.district)

        if (
            Neighborhood.objects.exclude(id=instance.id)
            .filter(
                district=district,
                name__iexact=name,
            )
            .exists()
        ):

            raise serializers.ValidationError(
                {"name": "این محله قبلاً در این منطقه ثبت شده است."}
            )

        return attrs

    def update(self, instance, validated_data):

        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.save()

        return instance
