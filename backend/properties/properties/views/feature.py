from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from properties.models import Feature

from properties.selector.feature_selector import FeatureSelector

from properties.serializers.feature_create import FeatureCreateSerializer
from properties.serializers.feature_update import FeatureUpdateSerializer
from properties.serializers.feature_list import FeatureListSerializer
from accounts.permissions import *
from audit.services.activity_log import ActivityLogService


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

    serializer_class =  FeatureListSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "view_feature"

    def get(self, request,pk):

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


class FeatureDeleteView(APIView):
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "delete_feature"

    def delete(self, request, pk):
        feature = FeatureSelector.by_id(pk)

        old_data = FeatureListSerializer(feature).data

        ActivityLogService.delete(
            request=request,
            entity_type="Feature",
            entity_id=feature.id,
            old_data=old_data,
            message="ویژگی حذف شد.",
        )

        feature.delete()

        return Response(
            {
                "message": "ویژگی حذف شد."
            },
            status=status.HTTP_204_NO_CONTENT,
        )