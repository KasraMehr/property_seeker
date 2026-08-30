from rest_framework import serializers

from crm.models import CallLog


class CallLogListSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(source="customer.full_name", read_only=True)

    customer_source = serializers.CharField(source="customer.source", read_only=True)

    agent_name = serializers.CharField(source="handled_by.full_name", read_only=True)

    class Meta:

        model = CallLog

        fields = (
            "id",
            "customer_name",
            "customer_source",
            "agent_name",
            "call_type",
            "result",
            "called_at",
        )
