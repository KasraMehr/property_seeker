from rest_framework import serializers

from ..models import Contract


class ContractUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Contract

        exclude = (
            "contract_number",
            "created_at",
            "updated_at",
        )

    def update(self, instance, validated_data):

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance