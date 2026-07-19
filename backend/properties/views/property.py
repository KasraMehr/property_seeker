from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import  *

from properties.selector.property_selector import PropertySelector
from properties.serializers.property_create import PropertyCreateSerializer
from properties.serializers.property_update import PropertyUpdateSerializer
from properties.serializers.property_list import PropertyListSerializer
from properties.serializers.property_detail import PropertyDetailSerializer


class PropertyCreateView(APIView):

    serializer_class = PropertyCreateSerializer
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

    def get(self, request):

        properties = PropertySelector.all()

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
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        property = PropertySelector.by_id(pk)

        serializer = self.serializer_class(property)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class PropertyUpdateView(APIView):
    serializer_class = PropertyUpdateSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):

        property = PropertySelector.by_id(pk)

        serializer = self.serializer_class(
            property,
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        property = serializer.save()

        return Response(
            {
                "message": "ملک با موفقیت بروزرسانی شد.",
                "property": PropertyDetailSerializer(property).data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):

        property = PropertySelector.by_id(pk)

        serializer = PropertyUpdateSerializer(
            property,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        property = serializer.save()

        return Response(
            {
                "message": "ملک با موفقیت بروزرسانی شد.",
                "property": PropertyDetailSerializer(property).data,
            },
            status=status.HTTP_200_OK,
        )


class PropertyDeleteView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        property = PropertySelector.by_id(pk)

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