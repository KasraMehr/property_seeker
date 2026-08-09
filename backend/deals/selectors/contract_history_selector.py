from django.shortcuts import get_object_or_404

from ..models import ContractHistory


class ContractHistorySelector:


    @staticmethod
    def all(user, contract_id=None):

        queryset = (
            ContractHistory.objects
            .filter(
                contract__agency=user.agency
            )
            .select_related(
                "contract",
                "changed_by",
            )
        )


        if contract_id:

            queryset = queryset.filter(
                contract_id=contract_id
            )


        return queryset



    @staticmethod
    def by_id(user, pk):

        return get_object_or_404(

            ContractHistory.objects.select_related(
                "contract",
                "changed_by",
            ),

            id=pk,
            contract__agency=user.agency
        )