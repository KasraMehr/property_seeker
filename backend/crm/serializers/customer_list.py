from rest_framework import serializers

from ..models import Customer


class CustomerListSerializer(serializers.ModelSerializer):

    assigned_agent_name = serializers.CharField(
        source="assigned_agent.full_name",
        read_only=True
    )

    class Meta:
        model = Customer
        fields = (
            "id",
            "full_name",
            "phone",
            "customer_type",
            "assigned_agent_name",
            "created_at",
        )