from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from properties.selector.property_status_history_selector import (
    PropertyStatusHistorySelector,
)

from properties.serializers.property_status_history_detail import (
    PropertyStatusHistoryDetailSerializer,
)

from properties.serializers.property_status_history_list import (
    PropertyStatusHistoryListSerializer,
)




class PropertyStatusHistoryListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        histories = PropertyStatusHistorySelector.all()

        serializer = PropertyStatusHistoryListSerializer(
            histories,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class PropertyStatusHistoryDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        history = PropertyStatusHistorySelector.by_id(pk)

        serializer = PropertyStatusHistoryDetailSerializer(
            history,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

