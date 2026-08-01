from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import HasRolePermission

from locations.selectors.neighborhood_selector import NeighborhoodSelector

from locations.serializers.neighborhood_create import NeighborhoodCreateSerializer
from locations.serializers.neighborhood_update import NeighborhoodUpdateSerializer
from locations.serializers.neighborhood_list import NeighborhoodSerializer


class NeighborhoodListCreateView(APIView):

    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    permission_map = {
        "GET": "locations.view_neighborhood",
        "POST": "locations.add_neighborhood",
    }

    serializer_class = NeighborhoodCreateSerializer

    def get(self, request):

        neighborhoods = NeighborhoodSelector.all()

        serializer = NeighborhoodSerializer(
            neighborhoods,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def post(self, request):

        serializer = self.serializer_class(
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        neighborhood = serializer.save()

        return Response(
            {
                "message": "محله با موفقیت ایجاد شد.",
                "neighborhood": NeighborhoodSerializer(neighborhood).data,
            },
            status=status.HTTP_201_CREATED,
        )


class NeighborhoodDetailView(APIView):

    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    permission_map = {
        "GET": "locations.view_neighborhood",
        "PUT": "locations.change_neighborhood",
        "PATCH": "locations.change_neighborhood",
        "DELETE": "locations.delete_neighborhood",
    }

    def get(self, request, pk):

        neighborhood = NeighborhoodSelector.by_id(pk)

        serializer = NeighborhoodSerializer(neighborhood)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def put(self, request, pk):

        neighborhood = NeighborhoodSelector.by_id(pk)

        serializer = NeighborhoodUpdateSerializer(
            neighborhood,
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        neighborhood = serializer.save()

        return Response(
            {
                "message": "محله با موفقیت بروزرسانی شد.",
                "neighborhood": NeighborhoodSerializer(neighborhood).data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):

        neighborhood = NeighborhoodSelector.by_id(pk)

        serializer = NeighborhoodUpdateSerializer(
            neighborhood,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        neighborhood = serializer.save()

        return Response(
            {
                "message": "محله با موفقیت بروزرسانی شد.",
                "neighborhood": NeighborhoodSerializer(neighborhood).data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):

        neighborhood = NeighborhoodSelector.by_id(pk)

        neighborhood.delete()

        return Response(
            {
                "message": "محله با موفقیت حذف شد."
            },
            status=status.HTTP_204_NO_CONTENT,
        )