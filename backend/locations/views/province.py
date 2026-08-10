from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import *
from locations.selectors.province_selector import ProvinceSelector
from locations.serializers.province_create import ProvinceCreateSerializer
from locations.serializers.province_detail import ProvinceDetailSerializer
from locations.serializers.province_list import ProvinceListSerializer
from locations.serializers.province_update import ProvinceUpdateSerializer


class ProvinceCreateView(APIView):

    serializer_class = ProvinceCreateSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "add_province"

    def post(self, request):

        serializer = self.serializer_class(
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        province = serializer.save()

        return Response(
            {
                "message": "استان با موفقیت ثبت شد.",
                "province": ProvinceDetailSerializer(province).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ProvinceListView(APIView):

    serializer_class = ProvinceListSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "view_province"

    def get(self, request):

        provinces = ProvinceSelector.all()

        serializer = self.serializer_class(
            provinces,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class ProvinceDetailView(APIView):

    serializer_class = ProvinceDetailSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "view_province"

    def get(self, request, pk):

        province = ProvinceSelector.detail(pk)

        serializer = self.serializer_class(province)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class ProvinceUpdateView(APIView):

    serializer_class = ProvinceUpdateSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "change_province"

    def put(self, request, pk):

        province = ProvinceSelector.by_id(pk)

        serializer = self.serializer_class(
            province,
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        province = serializer.save()

        return Response(
            {
                "message": "استان با موفقیت بروزرسانی شد.",
                "province": ProvinceDetailSerializer(province).data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):

        province = ProvinceSelector.by_id(pk)

        serializer = self.serializer_class(
            province,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        province = serializer.save()

        return Response(
            {
                "message": "استان با موفقیت بروزرسانی شد.",
                "province": ProvinceDetailSerializer(province).data,
            },
            status=status.HTTP_200_OK,
        )


class ProvinceBulkDeleteView(APIView):

    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "delete_province"

    def delete(self, request):
        province_ids = request.data.get("ids", [])

        if not province_ids:
            return Response(
                {"message": "حداقل یک استان را انتخاب کنید."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        deleted_count = 0

        for province_id in province_ids:
            province = ProvinceSelector.by_id(province_id)

            province.delete()
            deleted_count += 1

        return Response(
            {
                "message": f"{deleted_count} استان با موفقیت حذف شد.",
                "deleted_count": deleted_count,
            },
            status=status.HTTP_200_OK,
        )