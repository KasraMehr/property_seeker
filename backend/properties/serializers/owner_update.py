from rest_framework import serializers

from properties.models import Owner


class OwnerUpdateSerializer(serializers.ModelSerializer):
    alternate_phone = serializers.CharField(
        max_length=20,
        required=False,
    )
    full_name = serializers.CharField(
        required=False,
    )
    phone = serializers.CharField(
        max_length=20,
        required=False,
    )
    national_id =  serializers.CharField(required=False)
    notes = serializers.CharField(required=False)

    class Meta:
        model = Owner
        fields = (
            "full_name",
            "phone",
            "alternate_phone",
            "national_id",
            "notes",
        )

    def validate_phone(self, value):

        owner = self.instance

        if Owner.objects.exclude(id=owner.id).filter(phone=value).exists():
            raise serializers.ValidationError(
                "این شماره موبایل قبلاً ثبت شده است."
            )

        return value

    def update(self, instance, validated_data):

        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.save()

        return instance