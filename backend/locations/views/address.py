from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import HasRolePermission

from locations.selectors.address_selector import AddressSelector

from locations.serializers.address_create import AddressCreateSerializer
from locations.serializers.address_update import AddressUpdateSerializer
from locations.serializers.address_list import AddressSerializer


class AddressListCreateView(APIView):

    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    permission_map = {
        "GET": "locations.view_address",
        "POST": "locations.add_address",
    }

    serializer_class = AddressCreateSerializer

    def get(self, request):

        addresses = AddressSelector.all(request.user.agency)

        serializer = AddressSerializer(
            addresses,
            many=True,
        )

        return Response(serializer.data)

    def post(self, request):

        serializer = self.serializer_class(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        address = serializer.save()

        return Response(
            {
                "message": "آدرس با موفقیت ثبت شد.",
                "address": AddressSerializer(address).data,
            },
            status=status.HTTP_201_CREATED,
        )


class AddressDetailView(APIView):

    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    permission_map = {
        "GET": "locations.view_address",
        "PUT": "locations.change_address",
        "PATCH": "locations.change_address",
        "DELETE": "locations.delete_address",
    }

    def get(self, request, pk):

        address = AddressSelector.by_id(
            pk,
            request.user.agency,
        )

        return Response(
            AddressSerializer(address).data
        )

    def put(self, request, pk):

        address = AddressSelector.by_id(
            pk,
            request.user.agency,
        )

        serializer = AddressUpdateSerializer(
            address,
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            {
                "message": "آدرس بروزرسانی شد.",
                "address": AddressSerializer(address).data,
            }
        )

    def patch(self, request, pk):

        address = AddressSelector.by_id(
            pk,
            request.user.agency,
        )

        serializer = AddressUpdateSerializer(
            address,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            {
                "message": "آدرس بروزرسانی شد.",
                "address": AddressSerializer(address).data,
            }
        )

    def delete(self, request, pk):

        address = AddressSelector.by_id(
            pk,
            request.user.agency,
        )

        address.delete()

        return Response(
            {
                "message": "آدرس حذف شد."
            },
            status=status.HTTP_204_NO_CONTENT,
        )