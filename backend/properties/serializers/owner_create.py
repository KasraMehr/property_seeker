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

        agency = self.context["request"].user.agency

        if Owner.objects.filter(
            agency=agency,
            phone=value,
        ).exists():
            raise serializers.ValidationError(
                "این شماره موبایل قبلاً در آژانس شما ثبت شده است."
            )

        return value

    def create(self, validated_data):

        user = self.context["request"].user

        print("USER:", user)
        print("AGENCY:", user.agency)

        return Owner.objects.create(
            agency=user.agency, created_by=user, **validated_data
        )
