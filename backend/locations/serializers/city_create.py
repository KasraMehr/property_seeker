from rest_framework import serializers

from locations.models import City, Province


class CityCreateSerializer(serializers.ModelSerializer):

    province = serializers.PrimaryKeyRelatedField(
        queryset=Province.objects.all(),
    )

    class Meta:
        model = City
        fields = (
            "province",
            "name",
        )

    def validate(self, attrs):

        if City.objects.filter(
            province=attrs["province"],
            name=attrs["name"],
        ).exists():
            raise serializers.ValidationError("این شهر قبلاً در این استان ثبت شده است.")

        return attrs
