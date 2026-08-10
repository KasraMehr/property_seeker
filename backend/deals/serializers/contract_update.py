from rest_framework import serializers

from ..models import Contract, ContractHistory


class ContractUpdateSerializer(serializers.ModelSerializer):


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


        extra_kwargs = {
            field:{
                "required":False
            }
            for field in [
                "deal",
                "contract_type",
                "file",
                "start_date",
                "end_date",
                "status",
                "signed_by_customer",
                "signed_by_owner",
                "notes",
            ]
        }



    def update(self,instance,validated_data):

        user = self.context["request"].user


        changes=[]


        for field,value in validated_data.items():

            old_value = getattr(
                instance,
                field
            )


            if str(old_value) != str(value):

                changes.append(
                    {
                        "field":field,
                        "old":old_value,
                        "new":value
                    }
                )


            setattr(
                instance,
                field,
                value
            )


        instance.save()



        for change in changes:


            ContractHistory.objects.create(

                contract=instance,

                action=ContractHistory.Action.UPDATE,

                field_name=change["field"],

                old_value=str(change["old"]),

                new_value=str(change["new"]),

                changed_by=user
            )


        return instance