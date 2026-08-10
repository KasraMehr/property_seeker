from rest_framework import serializers

from locations.models import Address


class AddressCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address
        exclude = (
            "agency",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):

        agency = self.context["request"].user.agency

        if Address.objects.filter(
            agency=agency,
            neighborhood=attrs["neighborhood"],
            street=attrs.get("street", ""),
            alley=attrs.get("alley", ""),
            plaque=attrs.get("plaque", ""),
            unit=attrs.get("unit", ""),
        ).exists():

            raise serializers.ValidationError("این آدرس قبلاً ثبت شده است.")

        return attrs

    def create(self, validated_data):

        return Address.objects.create(
            agency=self.context["request"].user.agency,
            **validated_data,
        )
