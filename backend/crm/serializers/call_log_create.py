from rest_framework import serializers

from crm.models import CallLog
from properties.models import Owner

# from crm.models import Reminder  # TODO: Enable when auto-reminder from call is ready


class CallLogCreateSerializer(serializers.ModelSerializer):

    owner = serializers.PrimaryKeyRelatedField(
        queryset=Owner.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = CallLog

        exclude = (
            "id",
            "agency",
            "is_deleted",
            "handled_by",
            "created_at",
        )

        extra_kwargs = {
            "customer": {"required": False},
        }

    def validate_owner(self, value):

        user = self.context["request"].user

        if value.agency != user.agency:
            raise serializers.ValidationError(
                "مالک متعلق به آژانس شما نیست."
            )

        return value

    def validate_customer(self, value):

        user = self.context["request"].user

        if value.agency != user.agency:
            raise serializers.ValidationError(
                "مشتری متعلق به آژانس شما نیست."
            )

        return value

    def validate(self, attrs):

        owner = attrs.get("owner")

        if not owner and not attrs.get("customer"):
            raise serializers.ValidationError(
                {"customer": "انتخاب مشتری یا مالک الزامی است."}
            )

        return attrs

    def create(self, validated_data):

        user = self.context["request"].user

        return CallLog.objects.create(
            agency=user.agency,
            handled_by=user,
            **validated_data,
        )

        # TODO: Auto-create Reminder when follow-up date is set
        # next_follow_up_at = validated_data.get("next_follow_up_at")
        # follow_up_done = validated_data.get("follow_up_done", False)
        #
        # if next_follow_up_at and not follow_up_done:
        #     Reminder.objects.create(
        #         agency=user.agency,
        #         user=user,
        #         customer=call.customer,
        #         property=call.property,
        #         title=f"پیگیری تماس: {call.customer.full_name}",
        #         type="call",
        #         description=call.note or "",
        #         due_at=next_follow_up_at,
        #     )