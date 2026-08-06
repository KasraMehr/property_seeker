from rest_framework.views import APIView
from rest_framework.response import Response

from ..selectors.contract_history_selector import (
    ContractHistorySelector
)

from ..serializers.contract_history import (
    ContractHistorySerializer
)

from accounts.permissions import IsAgencyOwner

class ContractHistoryListView(APIView):

    permission_classes = [
        IsAgencyOwner
    ]


    def get(self,request,contract_id=None):

        histories = ContractHistorySelector.all(
            request.user,
            contract_id
        )


        serializer = ContractHistorySerializer(
            histories,
            many=True
        )


        return Response(
            serializer.data
        )




class ContractHistoryDetailView(APIView):

    permission_classes = [
        IsAgencyOwner
    ]


    def get(self,request,pk):

        history = ContractHistorySelector.by_id(
            request.user,
            pk
        )


        serializer = ContractHistorySerializer(
            history
        )


        return Response(
            serializer.data
        )