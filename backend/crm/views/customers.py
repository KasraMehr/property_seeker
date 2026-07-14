from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers.customer_create import CustomerCreateSerializer


class CustomerCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = CustomerCreateSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        customer = serializer.save()

        return Response(
            CustomerCreateSerializer(customer).data,
            status=status.HTTP_201_CREATED
        )


from ..selectors.customer_selector import CustomerSelector
from ..serializers.customer_list import CustomerListSerializer


class CustomerListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        customers = CustomerSelector.get_customers()

        serializer = CustomerListSerializer(
            customers,
            many=True
        )

        return Response(serializer.data)


from django.shortcuts import get_object_or_404

from ..models import Customer
from ..serializers.customer_detail import CustomerDetailSerializer


class CustomerDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        customer = CustomerSelector.get_customer(pk)

        serializer = CustomerDetailSerializer(customer)

        return Response(serializer.data)


from ..serializers.customer_update import CustomerUpdateSerializer


class CustomerUpdateView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, pk):

        customer = CustomerSelector.get_customer(pk)

        serializer = CustomerUpdateSerializer(
            customer,
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(serializer.data)


class CustomerDeleteView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        customer = CustomerSelector.get_customer(pk)

        customer.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )