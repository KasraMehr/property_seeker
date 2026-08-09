# Create your views here.
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import HasRolePermission
from locations.selectors.address_selector import AddressSelector
from locations.serializers.address_create import AddressCreateSerializer
from locations.serializers.address_list import AddressSerializer
from locations.serializers.address_update import AddressUpdateSerializer


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

        return Response(AddressSerializer(address).data)

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


class AddressBulkDeleteView(APIView):
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

    def delete(self, request):

        address_ids = request.data.get("ids", [])

        if not address_ids:
            return Response(
                {"message": "حداقل یک آدرس را انتخاب کنید."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        deleted_count = 0

        for address_id in address_ids:
            address = AddressSelector.by_id(
                address_id,
                request.user.agency,
            )

            address.delete()
            deleted_count += 1

        return Response(
            {
                "message": f"{deleted_count} آدرس با موفقیت حذف شد.",
                "deleted_count": deleted_count,
            },
            status=status.HTTP_200_OK,
        )

