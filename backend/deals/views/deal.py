from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAgencyOwner
from deals.selectors.deal_selector import DealSelector
from deals.serializers.deal_create import DealCreateSerializer
from deals.serializers.deal_detail import DealDetailSerializer
from deals.serializers.deal_list import DealListSerializer
from deals.serializers.deal_update import DealUpdateSerializer


class DealListCreateView(APIView):

    permission_classes = [
        IsAgencyOwner
    ]


    def get(self,request):

        deals = DealSelector.all(
            request.user
        )

        serializer = DealListSerializer(
            deals,
            many=True
        )


        return Response(
            serializer.data
        )



    def post(self,request):

        serializer = DealCreateSerializer(
            data=request.data,
            context={
                "request":request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        deal = serializer.save()


        return Response(
            {
                "message":
                "معامله ایجاد شد",

                "deal":
                DealDetailSerializer(deal).data
            },
            status=status.HTTP_201_CREATED
        )





class DealDetailView(APIView):

    permission_classes = [
        IsAgencyOwner
    ]



    def get(self,request,pk):

        deal = DealSelector.by_id(
            pk,
            request.user
        )


        serializer = DealDetailSerializer(
            deal
        )


        return Response(
            serializer.data
        )



    def put(self,request,pk):

        deal = DealSelector.by_id(
            pk,
            request.user
        )


        serializer = DealUpdateSerializer(
            deal,
            data=request.data,
            context={
                "request":request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        deal = serializer.save()


        return Response(
            {
                "message":
                "معامله بروزرسانی شد",

                "deal":
                DealDetailSerializer(deal).data
            }
        )



    def patch(self,request,pk):

        deal = DealSelector.by_id(
            pk,
            request.user
        )


        serializer = DealUpdateSerializer(
            deal,
            data=request.data,
            partial=True,
            context={
                "request":request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        deal = serializer.save()


        return Response(
            {
                "message":
                "معامله بروزرسانی شد",

                "deal":
                DealDetailSerializer(deal).data
            }
        )



    def delete(self,request,pk):

        deal = DealSelector.by_id(
            pk,
            request.user
        )


        deal.is_deleted=True

        deal.save()


        return Response(
            {
                "message":
                "معامله حذف شد"
            },
            status=204
        )