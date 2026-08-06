from rest_framework import serializers

from locations.models import Address


class AddressUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address
        exclude = (
            "agency",
            "created_at",
            "updated_at",
        )

        extra_kwargs = {
            "neighborhood": {"required": False},
            "street": {"required": False},
            "alley": {"required": False},
            "plaque": {"required": False},
            "unit": {"required": False},
            "postal_code": {"required": False},
            "latitude": {"required": False},
            "longitude": {"required": False},
            "full_text": {"required": False},
        }

    def validate(self, attrs):

        instance = self.instance

        neighborhood = attrs.get(
            "neighborhood",
            instance.neighborhood,
        )

        street = attrs.get(
            "street",
            instance.street,
        )

        alley = attrs.get(
            "alley",
            instance.alley,
        )

        plaque = attrs.get(
            "plaque",
            instance.plaque,
        )

        unit = attrs.get(
            "unit",
            instance.unit,
        )

        if Address.objects.exclude(
            id=instance.id
        ).filter(
            agency=instance.agency,
            neighborhood=neighborhood,
            street=street,
            alley=alley,
            plaque=plaque,
            unit=unit,
        ).exists():

            raise serializers.ValidationError(
                "این آدرس قبلاً ثبت شده است."
            )

        return attrs