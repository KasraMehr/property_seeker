from rest_framework import serializers

from ..models import Contract


class ContractListSerializer(serializers.ModelSerializer):

    deal_number = serializers.CharField(
        source="deal.deal_number",
        read_only=True
    )


    class Meta:

        model = Contract

        fields = (
            "id",
            "contract_number",
            "deal_number",
            "contract_type",
            "status",
            "start_date",
            "end_date",
            "created_at",
        )