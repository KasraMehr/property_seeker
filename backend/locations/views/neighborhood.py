from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import HasRolePermission
from locations.selectors.neighborhood_selector import NeighborhoodSelector
from locations.serializers.neighborhood_create import NeighborhoodCreateSerializer
from locations.serializers.neighborhood_list import NeighborhoodSerializer
from locations.serializers.neighborhood_update import NeighborhoodUpdateSerializer


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




class NeighborhoodBulkDeleteView(APIView):

    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "delete_neighborhood"

    def delete(self, request):
        neighborhood_ids = request.data.get("ids", [])

        if not neighborhood_ids:
            return Response(
                {"message": "حداقل یک محله را انتخاب کنید."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        deleted_count = 0

        for neighborhood_id in neighborhood_ids:
            neighborhood = NeighborhoodSelector.by_id(neighborhood_id)

            neighborhood.delete()
            deleted_count += 1

        return Response(
            {
                "message": f"{deleted_count} محله با موفقیت حذف شد.",
                "deleted_count": deleted_count,
            },
            status=status.HTTP_200_OK,
        )