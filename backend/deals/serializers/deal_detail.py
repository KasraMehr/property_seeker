from rest_framework import serializers

from deals.models import Deal


class DealDetailSerializer(serializers.ModelSerializer):

    property_title = serializers.CharField(
        source="property.title",
        read_only=True,
    )

    customer_name = serializers.CharField(
        source="customer.full_name",
        read_only=True,
    )

    customer_phone = serializers.CharField(
        source="customer.phone",
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
            "property",
            "property_title",
            "listing",
            "listing_code",
            "customer",
            "customer_name",
            "customer_phone",
            "agent",
            "agent_name",
            "deal_type",
            "status",
            "price",
            "deposit_amount",
            "rent_amount",
            "commission_amount",
            "deal_date",
            "closed_at",
            "notes",
            "created_at",
            "updated_at",
        )