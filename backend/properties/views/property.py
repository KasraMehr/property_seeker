from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import *
from ..models import  *
from accounts.permissions import *
from properties.selector.property_selector import PropertySelector
from properties.serializers.property_create import PropertyCreateSerializer
from properties.serializers.property_update import PropertyUpdateSerializer
from properties.serializers.property_list import PropertyListSerializer
from properties.serializers.property_detail import PropertyDetailSerializer
from accounts.permissions import *



class PropertyCreateView(APIView):

    serializer_class = PropertyCreateSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "add_property"

    def post(self, request):

        serializer = self.serializer_class(data=request.data,context={"request": request},)

        serializer.is_valid(raise_exception=True)

        property = serializer.save()

        return Response(
            {
                "message": "ملک با موفقیت ثبت شد.",
                "property": PropertyDetailSerializer(property).data,
            },
            status=status.HTTP_201_CREATED,
        )


class PropertyListView(APIView):
    serializer_class = PropertyListSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "view_property"

    def get(self, request):

        properties = PropertySelector.all(request.user)

        serializer = self.serializer_class(
            properties,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class PropertyDetailView(APIView):

    serializer_class = PropertyDetailSerializer
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "view_property"
    def get(self, request, pk):

        property = PropertySelector.by_id(pk,request.user)

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

        property = PropertySelector.by_id(
            pk,
            request.user
        )


        old_data = PropertyDetailSerializer(
            property
        ).data


        serializer = self.serializer_class(
            property,
            data=request.data,
            partial=True,
            context={
                "request":request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        property = serializer.save()

        return Response(
            {
                "message":
                "ملک بروزرسانی شد",

                "property":
                PropertyDetailSerializer(property).data
            }
        )


class PropertyDeleteView(APIView):
    permission_classes = (
        IsAuthenticated,
        HasRolePermission,
    )

    required_permission = "delete_property"

    def delete(self, request, pk):

        property = PropertySelector.by_id(pk,request.user)
        PropertyHistory.objects.create(
            property=property,
            action=PropertyHistory.Action.DELETE,
            field_name="property",
            old_value=property.property_code,
            new_value="",
            changed_by=request.user,
        )

        property.delete()

        return Response(
            {
                "message": "ملک با موفقیت حذف شد."
            },
            status=status.HTTP_204_NO_CONTENT,
        )