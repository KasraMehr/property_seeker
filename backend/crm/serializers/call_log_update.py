from rest_framework import serializers

from crm.models import CallLog


class CallLogUpdateSerializer(serializers.ModelSerializer):

    class Meta:

        model = CallLog

        exclude = (
            "id",
            "agency",
            "handled_by",
            "created_at",
            "is_deleted",
        )

        extra_kwargs = {
            field: {
                "required": False
            }
            for field in [
                "customer",
                "property",
                "listing",
                "call_type",
                "result",
                "note",
                "call_duration",
                "next_follow_up_at",
                "follow_up_done",
                "record_file",
                "called_at",
            ]
        }