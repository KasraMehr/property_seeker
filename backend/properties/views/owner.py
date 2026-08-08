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
from audit.services.activity_log import *
from rest_framework.generics import ListAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from ..models import Owner
from ..filter.owner_filter import OwnerFilter
from ..serializers.owner_list import OwnerListSerializer
from accounts.permissions import HasRolePermission


class OwnerListView(ListAPIView):

    serializer_class = OwnerListSerializer

    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "view_owner"

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = OwnerFilter

    search_fields = [
        "full_name",
        "phone",
        "national_id",
        "alternate_phone",
    ]

    ordering_fields = [
        "full_name",
        "created_at",
        "updated_at",
    ]

    ordering = [
        "-created_at"
    ]

    def get_queryset(self):

        user = self.request.user

        return (
            Owner.objects
            .filter(
                agency=user.agency
            )
            .select_related(
                "agency",
                "created_by",
            )
        )


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

        ActivityLogService.create(
            request=request,
            entity_type="Owner",
            entity_id=owner.id,
            new_data=OwnerDetailSerializer(owner).data,
            message="مالک جدید ایجاد شد.",
        )

        return Response(
            {
                "message": "مالک با موفقیت ثبت شد.",
                "owner": OwnerDetailSerializer(owner).data,
            },
            status=status.HTTP_201_CREATED,
        )



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
        old_data = OwnerDetailSerializer(owner).data
        serializer = self.serializer_class(
            owner,
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        owner = serializer.save()

        ActivityLogService.update(
            request=request,
            entity_type="Owner",
            entity_id=owner.id,
            old_data=old_data,
            new_data=OwnerDetailSerializer(owner).data,
            message="اطلاعات مالک بروزرسانی شد.",
        )

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
        old_data = OwnerDetailSerializer(owner).data
        serializer = self.serializer_class(
            owner,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)
        owner = serializer.save()

        ActivityLogService.update(
            request=request,
            entity_type="Owner",
            entity_id=owner.id,
            old_data=old_data,
            new_data=OwnerDetailSerializer(owner).data,
            message="اطلاعات مالک بروزرسانی شد.",
        )

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

        old_data = OwnerDetailSerializer(owner).data

        ActivityLogService.delete(
            request=request,
            entity_type="Owner",
            entity_id=owner.id,
            old_data=old_data,
            message="مالک حذف شد.",
        )

        owner.delete()

        return Response(
            {
                "message": "مالک با موفقیت حذف شد."
            },
            status=status.HTTP_204_NO_CONTENT,
        )