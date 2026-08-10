from rest_framework import serializers

from ..models import Owner


class OwnerUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Owner
        fields = (
            "full_name",
            "phone",
            "alternate_phone",
            "national_id",
            "notes",
        )

        extra_kwargs = {
            "full_name": {"required": False},
            "phone": {"required": False},
            "alternate_phone": {"required": False},
            "national_id": {"required": False},
            "notes": {"required": False},
        }

    def validate_phone(self, value):

        agency = self.context["request"].user.agency

        if (
            Owner.objects.filter(
                agency=agency,
                phone=value,
            )
            .exclude(pk=self.instance.pk)
            .exists()
        ):

            raise serializers.ValidationError("این شماره موبایل قبلاً ثبت شده است.")

        return value

    def update(self, instance, validated_data):

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance
