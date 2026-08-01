from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from locations.selectors.city_selector import CitySelector

from locations.serializers.city_create import CityCreateSerializer
from locations.serializers.city_update import CityUpdateSerializer
from locations.serializers.city_list import CityListSerializer
from locations.serializers.city_detail import CityDetailSerializer
from accounts.permissions import *

class CityCreateView(APIView):

    serializer_class = CityCreateSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "add_city"

    def post(self, request):

        serializer = self.serializer_class(data=request.data)

        serializer.is_valid(raise_exception=True)

        city = serializer.save()

        return Response(
            {
                "message": "شهر با موفقیت ثبت شد.",
                "city": CityDetailSerializer(city).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CityListView(APIView):

    serializer_class = CityListSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "list_province"

    def get(self, request):

        cities = CitySelector.all()

        serializer = self.serializer_class(
            cities,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class CityDetailView(APIView):

    serializer_class = CityDetailSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "view_city"

    def get(self, request, pk):

        city = CitySelector.detail(pk)

        serializer = self.serializer_class(city)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class CityUpdateView(APIView):

    serializer_class = CityUpdateSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "change_province"

    def put(self, request, pk):

        city = CitySelector.by_id(pk)

        serializer = self.serializer_class(
            city,
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        city = serializer.save()

        return Response(
            {
                "message": "شهر با موفقیت بروزرسانی شد.",
                "city": CityDetailSerializer(city).data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):

        city = CitySelector.by_id(pk)

        serializer = self.serializer_class(
            city,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        city = serializer.save()

        return Response(
            {
                "message": "شهر با موفقیت بروزرسانی شد.",
                "city": CityDetailSerializer(city).data,
            },
            status=status.HTTP_200_OK,
        )


class CityDeleteView(APIView):

    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "delete_province"

    def delete(self, request, pk):

        city = CitySelector.by_id(pk)

        city.delete()

        return Response(
            {
                "message": "شهر با موفقیت حذف شد."
            },
            status=status.HTTP_204_NO_CONTENT,
        )