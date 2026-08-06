from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from accounts.permissions import IsAgencyOwner

from ..selectors.contract_selector import ContractSelector

from ..serializers.contract_create import ContractCreateSerializer
from ..serializers.contract_update import ContractUpdateSerializer
from ..serializers.contract_detail import ContractDetailSerializer
from ..serializers.contract_list import ContractListSerializer




class ContractListCreateView(APIView):

    permission_classes = [
        IsAgencyOwner
    ]


    def get(self,request):

        contracts = ContractSelector.all(
            request.user
        )


        serializer = ContractListSerializer(
            contracts,
            many=True
        )


        return Response(
            serializer.data
        )



    def post(self,request):

        serializer = ContractCreateSerializer(
            data=request.data,
            context={
                "request":request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        contract = serializer.save()



        return Response(

            {
                "message":
                "قرارداد ایجاد شد",

                "contract":
                ContractDetailSerializer(contract).data
            },

            status=status.HTTP_201_CREATED
        )



class ContractDetailView(APIView):

    permission_classes=[
        IsAgencyOwner
    ]



    def get(self,request,pk):

        contract = ContractSelector.by_id(
            request.user,
            pk
        )


        return Response(
            ContractDetailSerializer(contract).data
        )



    def put(self,request,pk):

        contract = ContractSelector.by_id(
            request.user,
            pk
        )


        serializer = ContractUpdateSerializer(
            contract,
            data=request.data,
            context={
                "request":request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        contract=serializer.save()



        return Response(
            {
                "message":
                "قرارداد بروزرسانی شد",

                "contract":
                ContractDetailSerializer(contract).data
            }
        )



    def patch(self,request,pk):

        contract = ContractSelector.by_id(
            request.user,
            pk
        )


        serializer = ContractUpdateSerializer(
            contract,
            data=request.data,
            partial=True
        )


        serializer.is_valid(
            raise_exception=True
        )


        contract=serializer.save()


        return Response(
            ContractDetailSerializer(contract).data
        )



    def delete(self,request,pk):

        contract = ContractSelector.by_id(
            request.user,
            pk
        )


        contract.delete()


        return Response(
            {
                "message":
                "قرارداد حذف شد"
            },
            status=status.HTTP_204_NO_CONTENT
        )