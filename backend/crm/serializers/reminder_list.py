from rest_framework import serializers

from crm.models import Customer
from properties.models import Property
from accounts.models import User

from ..models import Reminder


class ReminderListSerializer(serializers.ModelSerializer):



    class Meta:

        model=Reminder

        fields=["due_at","title","type"]