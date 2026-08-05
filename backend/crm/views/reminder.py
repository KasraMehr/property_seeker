from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.utils import timezone

from accounts.permissions import HasRolePermission
from rest_framework.permissions import IsAuthenticated
from ..serializers import *
from ..selectors.reminder_selector import ReminderSelector
from ..serializers.reminder_create import *
from ..serializers.reminder_update import *
from ..serializers.reminder_list import *
from ..serializers.reminder_detail import *
from ..models import Reminder



class ReminderCreateView(APIView):

    permission_classes=[
        IsAuthenticated,

    ]



    def post(self,request):

        serializer=ReminderCreateSerializer(
            data=request.data,
            context={
                "request":request
            }
        )


        serializer.is_valid(
            raise_exception=True
        )


        reminder=serializer.save()


        return Response(
            ReminderDetailSerializer(reminder).data,
            status=201
        )





class ReminderListView(APIView):

    permission_classes=[
        IsAuthenticated,

    ]



    def get(self,request):

        reminders=ReminderSelector.all(
            request.user
        )


        return Response(

            ReminderDetailSerializer(
                reminders,
                many=True
            ).data

        )





class ReminderDetailView(APIView):

    permission_classes=[
        IsAuthenticated]



    def get(self,request,pk):

        reminder=ReminderSelector.by_id(
            pk,
            request.user
        )


        return Response(
            ReminderDetailSerializer(reminder).data
        )





class ReminderUpdateView(APIView):

    permission_classes=[
        IsAuthenticated,

    ]



    def put(self,request,pk):

        reminder=ReminderSelector.by_id(
            pk,
            request.user
        )


        serializer=ReminderUpdateSerializer(

            reminder,

            data=request.data,

            context={
                "request":request
            }

        )


        serializer.is_valid(
            raise_exception=True
        )


        reminder=serializer.save()


        return Response(
            ReminderDetailSerializer(reminder).data
        )





class ReminderDeleteView(APIView):

    permission_classes=[
        IsAuthenticated,

    ]


    def delete(self,request,pk):

        reminder=ReminderSelector.by_id(
            pk,
            request.user
        )
        reminder.delete()


        return Response(
            {
                "message":
                "یادآوری حذف شد."
            },
            status=204
        )