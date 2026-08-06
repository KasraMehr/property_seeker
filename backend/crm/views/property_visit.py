from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ..models import *
from accounts.permissions import *
from ..serializers.property_visit_create import *
from ..serializers.property_visit_detial import *
from ..serializers.property_visit_update import *
from ..serializers.property_visit_list import *
from ..selectors.property_visit_selector import *


class PropertyVisitCreateView(APIView):

    permission_classes = (
        IsAuthenticated,
    )

    serializer_class = PropertyVisitCreateSerializer

    def post(self,request):


        serializer = self.serializer_class(
            data=request.data,
            context={
                "request":request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        visit = serializer.save()


        return Response(

            {
                "message":"بازدید ثبت شد.",
                "id":visit.id
            },

            status=201
        )


class PropertyVisitListView(APIView):


    permission_classes = (
        IsAuthenticated,
    )



    def get(self,request):


        visits = PropertyVisitSelector.all(
            request.user
        )


        serializer = PropertyVisitListSerializer(
            visits,
            many=True
        )


        return Response(
            serializer.data
        )

class PropertyVisitUpdateView(APIView):


    permission_classes = (
        IsAuthenticated,
    )

    serializer_class = PropertyVisitUpdateSerializer
    def put(self,request,pk):


        visit = PropertyVisitSelector.by_id(
            pk,
            request.user
        )


        serializer = self.serializer_class(

            visit,

            data=request.data,

            context={
                "request":request
            }

        )


        serializer.is_valid(
            raise_exception=True
        )


        visit = serializer.save()



        return Response(

            {
                "message":
                "بازدید با موفقیت بروزرسانی شد.",


                "visit":
                PropertyVisitDetailSerializer(
                    visit
                ).data
            },

            status=status.HTTP_200_OK
        )




class PropertyVisitDetailView(APIView):

    permission_classes = (
        IsAuthenticated,

    )



    def get(self,request,pk):


        visit = PropertyVisitSelector.by_id(
            pk,
            request.user
        )


        serializer = PropertyVisitDetailSerializer(
            visit
        )


        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )