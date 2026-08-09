from rest_framework import serializers

from crm.models import *

from ..models import Reminder


class ReminderUpdateSerializer(serializers.ModelSerializer):

    class Meta:

        model = Reminder

        exclude = (
            "id",
            "agency",
            "created_at",
            "updated_at",
        )

        extra_kwargs = {
            field: {"required": False}
            for field in [
                "user",
                "customer",
                "property",
                "title",
                "type",
                "description",
                "due_at",
                "status",
                "completed_at",
            ]
        }

    def update(self, instance, validated_data):

        for field, value in validated_data.items():

            setattr(instance, field, value)

        instance.save()

        return instance
