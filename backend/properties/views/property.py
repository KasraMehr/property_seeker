from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import *
from accounts.permissions import HasRolePermission
from amlak.pagination import StandardPagination
from audit.services.activity_log import ActivityLogService
from properties.selector.property_selector import PropertySelector
from properties.serializers.property_create import PropertyCreateSerializer
from properties.serializers.property_detail import PropertyDetailSerializer
from properties.serializers.property_list import PropertyListSerializer
from properties.serializers.property_update import PropertyUpdateSerializer

from ..filter.property_filter import PropertyFilter
from ..models import *


class PropertyListView(APIView):

    serializer_class = PropertyListSerializer

    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "view_property"

    def get(self, request):

        # ==========================================
        # Base QuerySet
        # ==========================================

        properties = PropertySelector.all(request.user)

        # ==========================================
        # Filters
        # ==========================================

        filterset = PropertyFilter(
            data=request.query_params,
            queryset=properties,
        )

        if not filterset.is_valid():

            return Response(
                filterset.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        properties = filterset.qs

        # ==========================================
        # Ordering
        # ==========================================

        ordering = request.query_params.get("ordering")

        allowed_ordering = {
            "created_at",
            "-created_at",
            "updated_at",
            "-updated_at",
            "area",
            "-area",
            "sale_price",
            "-sale_price",
            "price_per_meter",
            "-price_per_meter",
            "age",
            "-age",
            "bedrooms",
            "-bedrooms",
            "floor",
            "-floor",
        }

        if ordering in allowed_ordering:

            properties = properties.order_by(ordering)

        # ==========================================
        # Pagination
        # ==========================================

        paginator = StandardPagination()
        page = paginator.paginate_queryset(properties, request)
        serializer = self.serializer_class(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class PropertyCreateView(APIView):

    serializer_class = PropertyCreateSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "add_property"

    def post(self, request):

        serializer = self.serializer_class(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        property = serializer.save()

        ActivityLogService.create(
            request=request,
            entity_type="Property",
            entity_id=property.id,
            new_data=PropertyDetailSerializer(property).data,
            message="ملک جدید ایجاد شد.",
        )

        return Response(
            {
                "message": "ملک با موفقیت ثبت شد.",
                "property": PropertyDetailSerializer(property).data,
            },
            status=status.HTTP_201_CREATED,
        )


class PropertyDetailView(APIView):

    serializer_class = PropertyDetailSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "view_property"

    def get(self, request, pk):

        property = PropertySelector.by_id(pk, request.user)

        serializer = self.serializer_class(property)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class PropertyUpdateView(APIView):

    serializer_class = PropertyUpdateSerializer

    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "change_property"

    def patch(self, request, pk):

        property = PropertySelector.by_id(pk, request.user)

        old_data = PropertyDetailSerializer(property).data

        serializer = self.serializer_class(
            property, data=request.data, partial=True, context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        property = serializer.save()

        ActivityLogService.update(
            request=request,
            entity_type="Property",
            entity_id=property.id,
            old_data=old_data,
            new_data=PropertyDetailSerializer(property).data,
            message="اطلاعات ملک بروزرسانی شد.",
        )

        return Response(
            {
                "message": "ملک بروزرسانی شد",
                "property": PropertyDetailSerializer(property).data,
            }
        )


class PropertyBulkDeleteView(APIView):
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "delete_property"

    def delete(self, request):
        property_ids = request.data.get("ids", [])

        if not property_ids:
            return Response(
                {"message": "حداقل یک ملک را انتخاب کنید."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        deleted_count = 0

        for property_id in property_ids:
            property = PropertySelector.by_id(
                property_id,
                request.user,
            )

            old_data = PropertyDetailSerializer(property).data

            PropertyHistory.objects.create(
                property=property,
                action=PropertyHistory.Action.DELETE,
                field_name="property",
                old_value=property.property_code,
                new_value="",
                changed_by=request.user,
            )

            ActivityLogService.delete(
                request=request,
                entity_type="Property",
                entity_id=property.id,
                old_data=old_data,
                message="ملک حذف شد.",
            )

            property.delete()
            deleted_count += 1

        return Response(
            {
                "message": f"{deleted_count} ملک با موفقیت حذف شد.",
                "deleted_count": deleted_count,
            },
            status=status.HTTP_200_OK,
        )