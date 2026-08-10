from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import *
from audit.services.activity_log import ActivityLogService
from properties.selector.feature_selector import FeatureSelector
from properties.serializers.feature_create import FeatureCreateSerializer
from properties.serializers.feature_list import FeatureListSerializer
from properties.serializers.feature_update import FeatureUpdateSerializer


class FeatureCreateView(APIView):

    serializer_class = FeatureCreateSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "add_feature"

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        serializer.is_valid(raise_exception=True)

        feature = serializer.save()

        ActivityLogService.create(
            request=request,
            entity_type="Feature",
            entity_id=feature.id,
            new_data=FeatureListSerializer(feature).data,
            message="ویژگی جدید ایجاد شد.",
        )

        return Response(
            {
                "message": "ویژگی با موفقیت ثبت شد.",
                "feature": FeatureListSerializer(feature).data,
            },
            status=status.HTTP_201_CREATED,
        )


class FeatureListView(APIView):

    serializer_class = FeatureListSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "view_feature"

    def get(self, request):

        features = FeatureSelector.all()

        serializer = self.serializer_class(
            features,
            many=True,
        )

        return Response(serializer.data)


class FeatureDetailView(APIView):

    serializer_class = FeatureListSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "view_feature"

    def get(self, request, pk):

        feature = FeatureSelector.by_id(pk)

        serializer = self.serializer_class(
            feature,
        )

        return Response(serializer.data)


class FeatureUpdateView(APIView):

    serializer_class = FeatureUpdateSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "change_feature"

    def put(self, request, pk):
        feature = FeatureSelector.by_id(pk)

        old_data = FeatureListSerializer(feature).data

        serializer = self.serializer_class(
            feature,
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        feature = serializer.save()

        ActivityLogService.update(
            request=request,
            entity_type="Feature",
            entity_id=feature.id,
            old_data=old_data,
            new_data=FeatureListSerializer(feature).data,
            message="ویژگی بروزرسانی شد.",
        )

        return Response(
            {
                "message": "ویژگی بروزرسانی شد.",
                "feature": FeatureListSerializer(feature).data,
            }
        )


class FeatureBulkDeleteView(APIView):
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "delete_feature"

    def delete(self, request):
        feature_ids = request.data.get("ids", [])

        if not feature_ids:
            return Response(
                {"message": "حداقل یک ویژگی را انتخاب کنید."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        deleted_count = 0

        for feature_id in feature_ids:
            feature = FeatureSelector.by_id(feature_id)

            old_data = FeatureListSerializer(feature).data

            ActivityLogService.delete(
                request=request,
                entity_type="Feature",
                entity_id=feature.id,
                old_data=old_data,
                message="ویژگی حذف شد.",
            )

            feature.delete()
            deleted_count += 1

        return Response(
            {
                "message": f"{deleted_count} ویژگی با موفقیت حذف شد.",
                "deleted_count": deleted_count,
            },
            status=status.HTTP_200_OK,
        )