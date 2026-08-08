from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.models import User
from accounts.permissions import IsAgencyOwner
from accounts.serializers.serializers import (
    UserSerializer,
    UserCreateSerializer,
    UserUpdateSerializer, RoleUpdateSerializer,
)
from audit.services.activity_log import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.models import User
from accounts.permissions import IsAgencyOwner
from ..filter.filters import UserFilter

from accounts.serializers.serializers import (
    UserSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
)

from audit.services.activity_log import ActivityLogService


class UserViewSet(viewsets.ModelViewSet):

    permission_classes = (
        IsAuthenticated,
        IsAgencyOwner,
    )

    # =========================
    # Filters
    # =========================

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = UserFilter

    # =========================
    # Search
    # =========================

    search_fields = [
        "full_name",
        "phone",
        "national_id",
    ]

    # =========================
    # Ordering
    # =========================

    ordering_fields = [
        "full_name",
        "created_at",
        "updated_at",
        "last_login",
        "is_active",
    ]

    ordering = [
        "-created_at"
    ]

    # =========================
    # Queryset
    # =========================

    def get_queryset(self):

        user = self.request.user

        queryset = (
            User.objects
            .select_related(
                "agency",
            )
            .prefetch_related(
                "service_neighborhoods",
                "role",
                "role__permissions",
            )
        )

        if user.is_owner:

            return queryset.filter(
                agency=user.agency
            )

        return queryset.filter(
            id=user.id
        )

    # =========================
    # Serializer
    # =========================

    def get_serializer_class(self):

        if self.action == "create":
            return UserCreateSerializer

        if self.action in (
            "update",
            "partial_update"
        ):
            return UserUpdateSerializer

        return UserSerializer

    # =========================
    # Create
    # =========================

    def perform_create(self, serializer):

        user = serializer.save()

        ActivityLogService.create(
            request=self.request,
            entity_type="User",
            entity_id=user.id,
            new_data=UserSerializer(user).data,
            message="کاربر جدید ایجاد شد.",
        )

    # =========================
    # Update
    # =========================

    def perform_update(self, serializer):

        old_data = UserSerializer(
            serializer.instance
        ).data

        user = serializer.save()

        ActivityLogService.update(
            request=self.request,
            entity_type="User",
            entity_id=user.id,
            old_data=old_data,
            new_data=UserSerializer(user).data,
            message="اطلاعات کاربر ویرایش شد.",
        )

    # =========================
    # Delete
    # =========================

    def perform_destroy(self, instance):

        old_data = UserSerializer(
            instance
        ).data

        ActivityLogService.delete(
            request=self.request,
            entity_type="User",
            entity_id=instance.id,
            old_data=old_data,
            message="کاربر حذف شد.",
        )

        instance.delete()

from accounts.models import Agency
from accounts.serializers.serializers import AgencySerializer
from accounts.permissions import IsAgencyOwner


class AgencyViewSet(viewsets.ModelViewSet):

    serializer_class = AgencySerializer

    permission_classes = (
        IsAgencyOwner,
    )

    def get_queryset(self):
        return Agency.objects.filter(
            id=self.request.user.agency_id
        )

    def get_serializer_class(self):
        if self.action == "create":
            return AgencyCreateSerializer

        elif self.action in ["update", "partial_update"]:
            return AgencyUpdateSerializer

        return AgencySerializer


    def perform_create(self, serializer):
        agency = serializer.save()

        ActivityLogService.create(
            request=self.request,
            entity_type="Agency",
            entity_id=agency.id,
            new_data=AgencySerializer(agency).data,
            message="آژانس ایجاد شد.",
        )

    def perform_update(self, serializer):
        old_data = AgencySerializer(
            serializer.instance
        ).data

        agency = serializer.save()

        ActivityLogService.update(
            request=self.request,
            entity_type="Agency",
            entity_id=agency.id,
            old_data=old_data,
            new_data=AgencySerializer(agency).data,
            message="اطلاعات آژانس ویرایش شد.",
        )

    def perform_destroy(self, instance):
        old_data = AgencySerializer(instance).data

        ActivityLogService.delete(
            request=self.request,
            entity_type="Agency",
            entity_id=instance.id,
            old_data=old_data,
            message="آژانس حذف شد.",
        )

        instance.delete()


from accounts.models import Role
from accounts.permissions import IsAgencyOwner
from accounts.serializers.serializers import *

class RoleViewSet(viewsets.ModelViewSet):

    permission_classes = (
        IsAuthenticated,
        IsAgencyOwner,
    )

    def get_queryset(self):
        return (
            Role.objects.filter(
                agency=self.request.user.agency
            ).prefetch_related("permissions")
        )

    def get_serializer_class(self):
        if self.action == "create":
            return RoleCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return RoleUpdateSerializer
        return RoleSerializer

    def perform_create(self, serializer):
        role = serializer.save(
            agency=self.request.user.agency
        )

        ActivityLogService.create(
            request=self.request,
            entity_type="Role",
            entity_id=role.id,
            new_data=RoleSerializer(role).data,
            message="نقش جدید ایجاد شد.",
        )

    def perform_update(self, serializer):
        old_data = RoleSerializer(
            serializer.instance
        ).data

        role = serializer.save()

        ActivityLogService.update(
            request=self.request,
            entity_type="Role",
            entity_id=role.id,
            old_data=old_data,
            new_data=RoleSerializer(role).data,
            message="نقش ویرایش شد.",
        )

    def perform_destroy(self, instance):
        old_data = RoleSerializer(instance).data

        ActivityLogService.delete(
            request=self.request,
            entity_type="Role",
            entity_id=instance.id,
            old_data=old_data,
            message="نقش حذف شد.",
        )

        instance.delete()



from collections import defaultdict
from ..serializers.serializers import *
from django.contrib.auth.models import Permission
from rest_framework.views import APIView
from rest_framework.response import Response


class PermissionListView(APIView):

    permission_classes = (
        IsAgencyOwner,
    )

    def get(self, request):

        permissions = (
            Permission.objects
            .select_related("content_type")
            .order_by(
                "content_type__model",
                "codename",
            )
        )

        grouped_permissions = defaultdict(list)

        for permission in permissions:

            model_name = permission.content_type.model

            grouped_permissions[model_name].append({
                "id": permission.id,
                "name": permission.name,
                "codename": permission.codename,
            })

        return Response(grouped_permissions)
