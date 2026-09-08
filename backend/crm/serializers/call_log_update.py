from rest_framework import serializers

from crm.models import CallLog, Customer
from properties.models import Owner


class CallLogUpdateSerializer(serializers.ModelSerializer):

    owner = serializers.PrimaryKeyRelatedField(
        queryset=Owner.objects.all(),
        required=False,
        allow_null=True,
    )

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
            field: {"required": False}
            for field in [
                "customer",
                "owner",
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

    def validate_owner(self, value):

        if value is None:
            return value

        user = self.context["request"].user

        if value.agency != user.agency:
            raise serializers.ValidationError(
                "مالک متعلق به آژانس شما نیست."
            )

        return value

    def validate_customer(self, value):

        if value is None:
            return value

        user = self.context["request"].user

        if value.agency != user.agency:
            raise serializers.ValidationError(
                "مشتری متعلق به آژانس شما نیست."
            )

        return value

    def validate(self, attrs):
        # In update, allow partial data without auto-creating customers
        return attrs

    def update(self, instance, validated_data):
        """
        Update call log without auto-creating customers.
        """
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
