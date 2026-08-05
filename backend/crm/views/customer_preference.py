from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


from crm.selectors.customer_preference import (
    CustomerPreferenceSelector
)


from crm.serializers.customer_preference_create import (
    CustomerPreferenceCreateSerializer
)

from crm.serializers.customer_preference_list import (
    CustomerPreferenceListSerializer
)

from crm.serializers.customer_preference_detail import (
    CustomerPreferenceDetailSerializer
)

from crm.serializers.customer_preference_update import (
    CustomerPreferenceUpdateSerializer
)

from accounts.permissions import *


class CustomerPreferenceListCreateView(APIView):

    permission_classes = [
        IsAuthenticated,
        HasRolePermission
    ]

    required_permission = "create_customer_preference"


    def get(self,request):
        preferences = CustomerPreferenceSelector.all(
            request.user
        )


        serializer = CustomerPreferenceListSerializer(
            preferences,
            many=True
        )


        return Response(
            serializer.data
        )



    def post(self,request):

        serializer = CustomerPreferenceCreateSerializer(
            data=request.data,
            context={
                "request":request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        preference = serializer.save()


        return Response(
            {
                "message":"ترجیحات مشتری ثبت شد",

                "preference":
                CustomerPreferenceDetailSerializer(
                    preference
                ).data
            },
            status=status.HTTP_201_CREATED
        )





class CustomerPreferenceDetailView(APIView):

    permission_classes = [
        IsAuthenticated,
        HasRolePermission
    ]

    required_permission = "view_customer_preference"


    def get(self,request,pk):

        preference = CustomerPreferenceSelector.by_id(
            pk,
            request.user
        )


        serializer = CustomerPreferenceDetailSerializer(
            preference
        )


        return Response(
            serializer.data
        )



    def patch(self,request,pk):

        preference = CustomerPreferenceSelector.by_id(
            pk,
            request.user
        )


        serializer = CustomerPreferenceUpdateSerializer(
            preference,
            data=request.data,
            partial=True
        )


        serializer.is_valid(
            raise_exception=True
        )


        serializer.save()


        return Response(
            {
                "message":"ترجیحات بروزرسانی شد"
            }
        )



    def delete(self,request,pk):

        preference = CustomerPreferenceSelector.by_id(
            pk,
            request.user
        )


        preference.delete()


        return Response(
            {
                "message":"حذف شد"
            },
            status=204
        )