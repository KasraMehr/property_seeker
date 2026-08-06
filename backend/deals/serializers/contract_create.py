from ..models import Contract, ContractHistory,Deal
from rest_framework import serializers

class ContractCreateSerializer(serializers.ModelSerializer):

    deal = serializers.PrimaryKeyRelatedField(
        queryset=Deal.objects.all()
    )


    class Meta:
        model = Contract

        exclude = (
            "id",
            "agency",
            "contract_number",
            "created_by",
            "created_at",
            "updated_at",
        )


    def __init__(self,*args,**kwargs):

        super().__init__(*args,**kwargs)

        request = self.context.get("request")

        if request:
            self.fields["deal"].queryset = Deal.objects.filter(
                agency=request.user.agency
            )


    def create(self,validated_data):

        user = self.context["request"].user


        contract = Contract.objects.create(
            agency=user.agency,
            created_by=user,
            **validated_data
        )


        ContractHistory.objects.create(
            contract=contract,
            action=ContractHistory.Action.CREATE,
            field_name="contract",
            old_value="",
            new_value="ایجاد قرارداد",
            changed_by=user
        )


        return contract