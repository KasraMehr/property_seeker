from rest_framework import serializers

from ..models import *
from .contract_history import *


class ContractDetailSerializer(serializers.ModelSerializer):

    deal_number = serializers.CharField(
        source="deal.deal_number",
        read_only=True
    )
    histories = ContractHistorySerializer(
        many=True,
        read_only=True
    )

    class Meta:

        model = Contract

        fields = (
            "histories",
            "id",
            "contract_number",
            "deal",
            "deal_number",
            "contract_type",
            "file",
            "start_date",
            "end_date",
            "status",
            "signed_by_customer",
            "signed_by_owner",
            "created_by",
            "notes",
            "created_at",
            "updated_at",
        )