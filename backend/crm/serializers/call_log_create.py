from rest_framework import serializers

from crm.models import CallLog
from crm.models import Customer


class CallLogCreateSerializer(serializers.ModelSerializer):

    class Meta:

        model = CallLog

        exclude = (
            "id",
            "agency",
            "is_deleted",
            "created_at",
        )

    def validate_customer(self, value):

        user = self.context["request"].user

        if value.agency != user.agency:

            raise serializers.ValidationError(
                "مشتری متعلق به آژانس شما نیست."
            )

        return value

    def create(self, validated_data):

        user = self.context["request"].user

        return CallLog.objects.create(
            agency=user.agency,
            handled_by=user,
            **validated_data
        )