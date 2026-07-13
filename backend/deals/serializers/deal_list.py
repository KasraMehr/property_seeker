from rest_framework import serializers

from deals.models import Deal


class DealListSerializer(serializers.ModelSerializer):

    property_title = serializers.CharField(
        source="property.title",
        read_only=True,
    )

    customer_name = serializers.CharField(
        source="customer.full_name",
        read_only=True,
    )

    agent_name = serializers.CharField(
        source="agent.full_name",
        read_only=True,
    )

    listing_code = serializers.CharField(
        source="listing.external_id",
        read_only=True,
    )

    class Meta:
        model = Deal
        fields = (
            "id",
            "property_title",
            "customer_name",
            "agent_name",
            "listing_code",
            "deal_type",
            "status",
            "price",
            "deposit_amount",
            "rent_amount",
            "commission_amount",
            "deal_date",
        )