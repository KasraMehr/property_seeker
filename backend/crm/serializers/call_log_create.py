from rest_framework import serializers

from crm.models import CallLog
# from crm.models import Reminder  # TODO: Enable when auto-reminder from call is ready


class CallLogCreateSerializer(serializers.ModelSerializer):

    class Meta:

        model = CallLog

        exclude = (
            "id",
            "agency",
            "is_deleted",
            "handled_by",
            "created_at",
        )

    def validate_customer(self, value):

        user = self.context["request"].user

        if value.agency != user.agency:

            raise serializers.ValidationError("مشتری متعلق به آژانس شما نیست.")

        return value

    def create(self, validated_data):

        user = self.context["request"].user

        return CallLog.objects.create(
            agency=user.agency, handled_by=user, **validated_data
        )

        # TODO: Auto-create Reminder when follow-up date is set
        # next_follow_up_at = validated_data.get("next_follow_up_at")
        # follow_up_done = validated_data.get("follow_up_done", False)
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
