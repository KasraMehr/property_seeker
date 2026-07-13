from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers.deal_create import DealCreateSerializer
from ..serializers.deal_detail import DealDetailSerializer
from ..serializers.deal_list import  DealListSerializer
from ..serializers.deal_update import DealUpdateSerializer
from ..selectors.deal_selector import DealSelector
# Create your views here.

class DealCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = DealCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        deal = serializer.save()

        return Response(
            {
                "message": "معامله با موفقیت ثبت شد.",
                "deal": DealDetailSerializer(deal).data,
            },
            status=status.HTTP_201_CREATED,
        )



class DealListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        deals = DealSelector.all()

        serializer = DealDetailSerializer(
            deals,
            many=True,
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class DealDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        deal = DealSelector.by_id(pk)

        serializer = DealDetailSerializer(deal)

        return Response(serializer.data, status=status.HTTP_200_OK)



