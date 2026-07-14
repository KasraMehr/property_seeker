from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from ..selectors.contract_selector import (
    get_contract,
    get_contracts,
)

from ..serializers.contract_create import (
    ContractCreateSerializer,
)

from ..serializers.contract_update import (
    ContractUpdateSerializer,
)

from ..serializers.contract_detail import (
    ContractDetailSerializer,
)

from ..serializers.contract_list import (
    ContractListSerializer,
)


class ContractCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ContractCreateSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        contract = serializer.save()

        return Response(
            {
                "message": "قرارداد با موفقیت ایجاد شد.",
                "contract": ContractDetailSerializer(contract).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ContractListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        contracts = get_contracts()

        serializer = ContractListSerializer(
            contracts,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class ContractDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        contract = get_contract(pk)

        serializer = ContractDetailSerializer(
            contract
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class ContractUpdateView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, pk):

        contract = get_contract(pk)

        serializer = ContractUpdateSerializer(
            contract,
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True
        )

        contract = serializer.save()

        return Response(
            {
                "message": "قرارداد با موفقیت بروزرسانی شد.",
                "contract": ContractDetailSerializer(contract).data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):

        contract = get_contract(pk)

        serializer = ContractUpdateSerializer(
            contract,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True
        )

        contract = serializer.save()

        return Response(
            {
                "message": "قرارداد با موفقیت بروزرسانی شد.",
                "contract": ContractDetailSerializer(contract).data,
            },
            status=status.HTTP_200_OK,
        )


class ContractDeleteView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        contract = get_contract(pk)

        contract.delete()

        return Response(
            {
                "message": "قرارداد با موفقیت حذف شد."
            },
            status=status.HTTP_204_NO_CONTENT,
        )