from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import *
from audit.services.activity_log import *
from properties.selector.property_feature_selector import PropertyFeatureSelector
from properties.serializers.property_feature_create import (
    PropertyFeatureCreateSerializer,
)
from properties.serializers.property_feature_detail import (
    PropertyFeatureDetailSerializer,
)
from properties.serializers.property_feature_list import PropertyFeatureListSerializer
from properties.serializers.property_feature_update import (
    PropertyFeatureUpdateSerializer,
)


class PropertyFeatureCreateView(APIView):
    serializer_class = PropertyFeatureCreateSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "add_property_feature"

    def post(self, request):

        serializer = self.serializer_class(data=request.data)

        serializer.is_valid(raise_exception=True)

        property_feature = serializer.save()

        ActivityLogService.create(
            request=request,
            entity_type="PropertyFeature",
            entity_id=property_feature.id,
            new_data=PropertyFeatureDetailSerializer(property_feature).data,
            message="ویژگی به ملک اضافه شد.",
        )

        return Response(
            {
                "message": "ویژگی با موفقیت به ملک اضافه شد.",
                "property_feature": PropertyFeatureDetailSerializer(
                    property_feature
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class PropertyFeatureListView(APIView):

    serializer_class = PropertyFeatureListSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "view_property_feature"

    def get(self, request):

        property_features = PropertyFeatureSelector.all(request.user)

        serializer = self.serializer_class(
            property_features,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class PropertyFeatureDetailView(APIView):

    serializer_class = PropertyFeatureDetailSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "view_property_feature"

    def get(self, request, pk):

        property_feature = PropertyFeatureSelector.by_id(pk, request.user)

        serializer = self.serializer_class(property_feature)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class PropertyFeatureUpdateView(APIView):

    serializer_class = PropertyFeatureUpdateSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "change_property_feature"

    def put(self, request, pk):

        property_feature = PropertyFeatureSelector.by_id(pk, request.user)
        old_data = PropertyFeatureDetailSerializer(property_feature).data
        serializer = self.serializer_class(
            property_feature,
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        property_feature = serializer.save()

        ActivityLogService.update(
            request=request,
            entity_type="PropertyFeature",
            entity_id=property_feature.id,
            old_data=old_data,
            new_data=PropertyFeatureDetailSerializer(property_feature).data,
            message="ویژگی ملک ویرایش شد.",
        )

        return Response(
            {
                "message": "ویژگی ملک با موفقیت ویرایش شد.",
                "property_feature": PropertyFeatureDetailSerializer(
                    property_feature
                ).data,
            },
            status=status.HTTP_200_OK,
        )



class PropertyFeatureBulkDeleteView(APIView):
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "delete_property_feature"

    def delete(self, request):
        property_feature_ids = request.data.get("ids", [])

        if not property_feature_ids:
            return Response(
                {"message": "حداقل یک ویژگی را انتخاب کنید."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        deleted_count = 0

        for property_feature_id in property_feature_ids:
            property_feature = PropertyFeatureSelector.by_id(
                property_feature_id,
                request.user,
            )

            old_data = PropertyFeatureDetailSerializer(
                property_feature
            ).data

            ActivityLogService.delete(
                request=request,
                entity_type="PropertyFeature",
                entity_id=property_feature.id,
                old_data=old_data,
                message="ویژگی از ملک حذف شد.",
            )

            property_feature.delete()
            deleted_count += 1

        return Response(
            {
                "message": f"{deleted_count} ویژگی از ملک با موفقیت حذف شد.",
                "deleted_count": deleted_count,
            },
            status=status.HTTP_200_OK,
        )