from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..selector.owner_selector import OwnerSelector
from..serializers.owner_create import OwnerCreateSerializer
from ..serializers.owner_update import OwnerUpdateSerializer
from ..serializers.owner_list import OwnerListSerializer
from ..serializers.owner_detail import OwnerDetailSerializer
from accounts.permissions import *


class OwnerCreateView(APIView):

    serializer_class = OwnerCreateSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "add_owner"

    def post(self, request):

        serializer = self.serializer_class(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        owner = serializer.save()



        return Response(
            {
                "message": "مالک با موفقیت ثبت شد.",
                "owner": OwnerDetailSerializer(owner).data,
            },
            status=status.HTTP_201_CREATED,
        )

class OwnerListView(APIView):

    serializer_class = OwnerListSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "view_owner"
    def get(self, request):

        owners = OwnerSelector.all(
            agency=request.user.agency
        )

        serializer = self.serializer_class(
            owners,
            many=True,
        )

        return Response(serializer.data)

class OwnerDetailView(APIView):

    serializer_class = OwnerDetailSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "view_owner"


    def get(self, request, pk):

        owner = OwnerSelector.detail(
            owner_id=pk,
            agency=request.user.agency,
        )

        serializer = self.serializer_class(owner)

        return Response(serializer.data)



class OwnerUpdateView(APIView):

    serializer_class = OwnerUpdateSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "change_owner"

    def put(self, request, pk):

        owner = OwnerSelector.by_id(
            owner_id=pk,
            agency=request.user.agency,
        )

        serializer = self.serializer_class(
            owner,
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        owner = serializer.save()


        return Response(
            {
                "message": "اطلاعات مالک با موفقیت بروزرسانی شد.",
                "owner": OwnerDetailSerializer(owner).data,
            }
        )



    def patch(self, request, pk):

        owner = OwnerSelector.by_id(
            owner_id=pk,
            agency=request.user.agency,
        )

        serializer = self.serializer_class(
            owner,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)
        owner = serializer.save()

        return Response(
            {
                "message": "اطلاعات مالک با موفقیت بروزرسانی شد.",
                "owner": OwnerDetailSerializer(owner).data,
            })

class OwnerDeleteView(APIView):
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "delete_owner"

    def delete(self, request, pk):
        owner = OwnerSelector.by_id(
            owner_id=pk,
            agency=request.user.agency,
        )

        owner.delete()

        return Response(
            {
                "message": "مالک با موفقیت حذف شد."
            },
            status=status.HTTP_204_NO_CONTENT,
        )