from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import *
from crm.selectors.customer_preference import CustomerPreferenceSelector
from crm.serializers.customer_preference_create import (
    CustomerPreferenceCreateSerializer,
)
from crm.serializers.customer_preference_detail import (
    CustomerPreferenceDetailSerializer,
)
from crm.serializers.customer_preference_list import CustomerPreferenceListSerializer
from crm.serializers.customer_preference_update import (
    CustomerPreferenceUpdateSerializer,
)


class CustomerPreferenceListCreateView(APIView):

    permission_classes = [IsAuthenticated, HasRolePermission]

    required_permission = "create_customer_preference"

    def get(self, request):
        preferences = CustomerPreferenceSelector.all(request.user)

        serializer = CustomerPreferenceListSerializer(preferences, many=True)

        return Response(serializer.data)

    def post(self, request):

        serializer = CustomerPreferenceCreateSerializer(
            data=request.data, context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        preference = serializer.save()

        return Response(
            {
                "message": "ترجیحات مشتری ثبت شد",
                "preference": CustomerPreferenceDetailSerializer(preference).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CustomerPreferenceDetailView(APIView):

    permission_classes = [IsAuthenticated, HasRolePermission]

    required_permission = "view_customer_preference"

    def get(self, request, pk):

        preference = CustomerPreferenceSelector.by_id(pk, request.user)

        serializer = CustomerPreferenceDetailSerializer(preference)

        return Response(serializer.data)

    def patch(self, request, pk):

        preference = CustomerPreferenceSelector.by_id(pk, request.user)

        serializer = CustomerPreferenceUpdateSerializer(
            preference, data=request.data, partial=True
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response({"message": "ترجیحات بروزرسانی شد"})


class CustomerPreferenceBulkDeleteView(APIView):
        permission_classes = (
            IsAuthenticated,
            HasRolePermission,
        )

        required_permission = "delete_customer_preference"

        def delete(self, request):
            preference_ids = request.data.get("ids", [])

            if not preference_ids:
                return Response(
                    {"message": "حداقل یک مورد را انتخاب کنید."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            deleted_count = 0

            for preference_id in preference_ids:
                preference = CustomerPreferenceSelector.by_id(
                    preference_id,
                    request.user,
                )

                preference.delete()
                deleted_count += 1

            return Response(
                {
                    "message": f"{deleted_count} مورد با موفقیت حذف شد.",
                    "deleted_count": deleted_count,
                },
                status=status.HTTP_200_OK,
            )
