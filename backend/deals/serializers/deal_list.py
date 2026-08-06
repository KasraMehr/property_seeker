from rest_framework import serializers

from deals.models import Deal


class DealListSerializer(serializers.ModelSerializer):

    property_code = serializers.CharField(
        source="property.property_code",
        read_only=True
    )

    customer_name = serializers.CharField(
        source="customer.full_name",
        read_only=True
    )

    agent_name = serializers.CharField(
        source="agent.full_name",
        read_only=True
    )


    class Meta:
        model = Deal

        fields = (
            "id",

            "deal_number",

            "property_code",

            "customer_name",

            "agent_name",

            "deal_type",

            "price",

            "commission_amount",

            "status",

            "deal_date",

            "created_at",
        )