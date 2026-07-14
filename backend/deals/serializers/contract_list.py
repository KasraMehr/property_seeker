from rest_framework import serializers

from ..models import Contract


class ContractListSerializer(serializers.ModelSerializer):

    deal_number = serializers.CharField(
        source="deal.deal_number",
        read_only=True,
    )

    customer = serializers.CharField(
        source="deal.customer.full_name",
        read_only=True,
    )

    agent = serializers.CharField(
        source="deal.agent.full_name",
        read_only=True,
    )

    property = serializers.CharField(
        source="deal.property.title",
        read_only=True,
    )

    class Meta:
        model = Contract
        fields = (
            "id",
            "contract_number",
            "contract_type",
            "status",
            "deal_number",
            "customer",
            "agent",
            "property",
            "created_at",
        )