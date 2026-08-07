from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from properties.selector.property_feature_selector import PropertyFeatureSelector

from properties.serializers.property_feature_create import (
    PropertyFeatureCreateSerializer,
)

from properties.serializers.property_feature_update import (
    PropertyFeatureUpdateSerializer,
)

from properties.serializers.property_feature_detail import (
    PropertyFeatureDetailSerializer,
)

from properties.serializers.property_feature_list import (
    PropertyFeatureListSerializer,
)

from accounts.permissions import *


class PropertyFeatureCreateView(APIView):
    serializer_class = PropertyFeatureCreateSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "add_property_feature"

    def post(self, request):

        serializer = self.serializer_class(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        property_feature = serializer.save()

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

        property_feature = PropertyFeatureSelector.by_id(pk,request.user)

        serializer = self.serializer_class(
            property_feature
        )

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

        property_feature = PropertyFeatureSelector.by_id(pk,request.user)
        serializer = self.serializer_class(
            property_feature,
            data=request.data,context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        property_feature = serializer.save()

        return Response(
            {
                "message": "ویژگی ملک با موفقیت ویرایش شد.",
                "property_feature": PropertyFeatureDetailSerializer(
                    property_feature
                ).data,
            },
            status=status.HTTP_200_OK,
        )



class PropertyFeatureDeleteView(APIView):
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "delete_property_feature"

    def delete(self, request, pk):

        property_feature = PropertyFeatureSelector.by_id(pk,request.user)

        property_feature.delete()

        return Response(
            {
                "message": "ویژگی از ملک حذف شد."
            },
            status=status.HTTP_200_OK,
        )