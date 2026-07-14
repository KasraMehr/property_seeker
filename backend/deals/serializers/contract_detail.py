from rest_framework import serializers

from ..models import Contract


class ContractDetailSerializer(serializers.ModelSerializer):

    deal_number = serializers.CharField(
        source="deal.deal_number",
        read_only=True
    )

    class Meta:
        model = Contract
        fields = "__all__"