from rest_framework import serializers

from ..models import ContractHistory


class ContractHistorySerializer(serializers.ModelSerializer):

    changed_by_name = serializers.CharField(
        source="changed_by.full_name",
        read_only=True
    )


    class Meta:

        model = ContractHistory

        fields = (
            "id",
            "action",
            "field_name",
            "old_value",
            "new_value",
            "changed_by_name",
            "created_at",
        )