from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from locations.selectors.district_selector import DistrictSelector
from locations.serializers.district_list import *
from locations.serializers.district_update import *
from locations.serializers.district_create import *
from accounts.permissions import *

class DistrictListCreateView(APIView):

    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )
    permission_map = {
        "GET": "locations.view_district",
        "POST": "locations.add_district",
    }


    def get(self, request):

        districts = DistrictSelector.all()

        serializer = DistrictSerializer(
            districts,
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

        district = serializer.save()

        return Response(
            {
                "message": "منطقه با موفقیت ایجاد شد.",
                "district": DistrictSerializer(district).data,
            },
            status=status.HTTP_201_CREATED,
        )


class DistrictDetailView(APIView):

    permission_classes = [IsAuthenticated,HasRolePermission]
    permission_map = {
        "GET": "locations.view_district",
        "PUT": "locations.change_district",
        "PATCH": "locations.change_district",
        "DELETE": "locations.delete_district",
    }

    def get(self, request, pk):

        district = DistrictSelector.by_id(pk)

        serializer = DistrictSerializer(district)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def put(self, request, pk):

        district = DistrictSelector.by_id(pk)

        serializer = DistrictUpdateSerializer(
            district,
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        district = serializer.save()

        return Response(
            {
                "message": "منطقه با موفقیت بروزرسانی شد.",
                "district": DistrictSerializer(district).data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):

        district = DistrictSelector.by_id(pk)

        serializer = DistrictUpdateSerializer(
            district,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        district = serializer.save()

        return Response(
            {
                "message": "منطقه با موفقیت بروزرسانی شد.",
                "district": DistrictSerializer(district).data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):

        district = DistrictSelector.by_id(pk)

        district.delete()

        return Response(
            {
                "message": "منطقه با موفقیت حذف شد."
            },
            status=status.HTTP_204_NO_CONTENT,
        )