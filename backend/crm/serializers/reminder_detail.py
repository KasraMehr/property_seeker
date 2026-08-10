from rest_framework import serializers

from ..models import Reminder


class ReminderDetailSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(source="customer.full_name", read_only=True)

    property_code = serializers.CharField(
        source="property.property_code", read_only=True
    )

    user_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:

        model = Reminder

        fields = "__all__"
