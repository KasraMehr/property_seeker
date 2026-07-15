from rest_framework import serializers

from ..models import Owner


class OwnerCreateSerializer(serializers.ModelSerializer):

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

        if Owner.objects.filter(phone=value).exists():
            raise serializers.ValidationError(
                "این شماره موبایل قبلاً ثبت شده است."
            )

        return value

    def create(self, validated_data):
        return Owner.objects.create(**validated_data)