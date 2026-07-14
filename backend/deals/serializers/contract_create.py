from rest_framework import serializers

from ..models import Contract


class ContractCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Contract
        exclude = (
            "contract_number",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        return Contract.objects.create(**validated_data)