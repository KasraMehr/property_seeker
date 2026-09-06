from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import *
from amlak.pagination import StandardPagination
from crm.filter.customer_filter import CustomerFilter
from crm.selectors.customers import CustomerSelector
from crm.serializers.customer_create import CustomerCreateSerializer
from crm.serializers.customer_detail import CustomerDetailSerializer
from crm.serializers.customer_list import CustomerListSerializer
from crm.serializers.customer_update import CustomerUpdateSerializer


class CustomerListCreateView(APIView):

    permission_classes = [IsAuthenticated, HasRolePermission]

    required_permission = "add_customer"

    def get(self, request):

        queryset = CustomerSelector.all(request.user)

        filterset = CustomerFilter(request.GET, queryset=queryset)

        if not filterset.is_valid():
            return Response(
                filterset.errors, status=status.HTTP_400_BAD_REQUEST
            )

        customers = filterset.qs

        paginator = StandardPagination()
        page = paginator.paginate_queryset(customers, request)
        serializer = CustomerListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):

        serializer = CustomerCreateSerializer(
            data=request.data, context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        customer = serializer.save()

        return Response(
            {
                "message": "مشتری ایجاد شد",
                "customer": CustomerDetailSerializer(customer).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CustomerDetailView(APIView):
    permission_classes = [IsAuthenticated, HasRolePermission]

    required_permission = "view_customer"

    def get(self, request, pk):

        customer = CustomerSelector.by_id(pk, request.user)

        serializer = CustomerDetailSerializer(customer)

        return Response(serializer.data)

    def put(self, request, pk):

        customer = CustomerSelector.by_id(pk, request.user)

        serializer = CustomerUpdateSerializer(
            customer, data=request.data, context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response({"message": "مشتری بروزرسانی شد"})

    def patch(self, request, pk):

        customer = CustomerSelector.by_id(pk, request.user)

        serializer = CustomerUpdateSerializer(
            customer, data=request.data, partial=True, context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response({"message": "مشتری بروزرسانی شد"})

class CustomerBulkDeleteView(APIView):
        permission_classes = (
            IsAuthenticated,
            HasRolePermission,
        )

        required_permission = "delete_customer"

        def delete(self, request):
            customer_ids = request.data.get("ids", [])

            if not customer_ids:
                return Response(
                    {"message": "حداقل یک مشتری را انتخاب کنید."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            deleted_count = 0

            for customer_id in customer_ids:
                customer = CustomerSelector.by_id(
                    customer_id,
                    request.user,
                )

                customer.is_deleted = True
                customer.save(update_fields=["is_deleted"])

                deleted_count += 1

            return Response(
                {
                    "message": f"{deleted_count} مشتری با موفقیت حذف شد.",
                    "deleted_count": deleted_count,
                },
                status=status.HTTP_200_OK,
            )
