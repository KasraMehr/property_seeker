from rest_framework import serializers

from ..models import Reminder


class ReminderListSerializer(serializers.ModelSerializer):

    class Meta:

        model = Reminder

        fields = ["due_at", "title", "type"]
