from rest_framework import serializers

from deals.models import Deal


class DealDetailSerializer(serializers.ModelSerializer):

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

            "property",
            "property_code",

            "customer",
            "customer_name",

            "agent",
            "agent_name",

            "deal_type",

            "price",
            "deposit_amount",
            "rent_amount",

            "commission_amount",

            "status",

            "deal_date",
            "closed_at",

            "notes",

            "created_by",
            "created_at",
            "updated_at",
        )