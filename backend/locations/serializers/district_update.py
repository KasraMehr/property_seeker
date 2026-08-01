from rest_framework import serializers

from locations.models import District,City


class DistrictUpdateSerializer(serializers.ModelSerializer):

    name = serializers.CharField(
        required=False,
    )

    city = serializers.PrimaryKeyRelatedField(

    queryset=City.objects.all(),


        required=False,)


    class Meta:
        model = District
        fields = (
            "name",
            "city",
        )

    def validate(self, attrs):

        name = attrs.get("name", self.instance.name).strip()
        city = attrs.get("city", self.instance.city)

        if (
            District.objects.exclude(id=self.instance.id)
            .filter(
                city=city,
                name__iexact=name,
            )
            .exists()
        ):
            raise serializers.ValidationError(
                {
                    "name": "این منطقه قبلاً در این شهر ثبت شده است."
                }
            )

        attrs["name"] = name

        return attrs