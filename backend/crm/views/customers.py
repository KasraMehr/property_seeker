from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


from crm.selectors.customers import CustomerSelector


from crm.serializers.customer_create import CustomerCreateSerializer
from crm.serializers.customer_list import CustomerListSerializer
from crm.serializers.customer_detail import CustomerDetailSerializer
from crm.serializers.customer_update import CustomerUpdateSerializer
from accounts.permissions import *


class CustomerListCreateView(APIView):

    permission_classes = [
        IsAuthenticated,
        HasRolePermission
    ]

    required_permission = "create_customer"



    def get(self,request):

        customers = CustomerSelector.all(
            request.user
        )


        serializer = CustomerListSerializer(
            customers,
            many=True
        )


        return Response(
            serializer.data
        )



    def post(self,request):

        serializer = CustomerCreateSerializer(
            data=request.data,
            context={
                "request":request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        customer = serializer.save()


        return Response(
            {
                "message":"مشتری ایجاد شد",
                "customer":
                    CustomerDetailSerializer(customer).data
            },
            status=status.HTTP_201_CREATED
        )




class CustomerDetailView(APIView):
    permission_classes = [
        IsAuthenticated,
        HasRolePermission
    ]

    required_permission = "view_customer"



    def get(self,request,pk):

        customer = CustomerSelector.by_id(
            pk,
            request.user
        )


        serializer = CustomerDetailSerializer(
            customer
        )


        return Response(
            serializer.data
        )



    def put(self,request,pk):

        customer = CustomerSelector.by_id(
            pk,
            request.user
        )


        serializer = CustomerUpdateSerializer(
            customer,
            data=request.data,
            context={
                "request":request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        serializer.save()


        return Response(
            {
                "message":"مشتری بروزرسانی شد"
            }
        )



    def patch(self,request,pk):

        customer = CustomerSelector.by_id(
            pk,
            request.user
        )


        serializer = CustomerUpdateSerializer(
            customer,
            data=request.data,
            partial=True,
            context={
                "request":request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        serializer.save()


        return Response(
            {
                "message":"مشتری بروزرسانی شد"
            }
        )



    def delete(self,request,pk):

        customer = CustomerSelector.by_id(
            pk,
            request.user
        )


        customer.is_deleted=True

        customer.save()


        return Response(
            {
                "message":"مشتری حذف شد"
            },
            status=204
        )