import django_filters

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from ..filter.reminder_filter import ReminderFilter
from crm.selectors.reminder_selector import ReminderSelector
from crm.serializers.reminder_detail import ReminderDetailSerializer


class ReminderListView(APIView):

    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):

        # ==========================================
        # Base QuerySet
        # ==========================================

        reminders = ReminderSelector.all(
            request.user
        )

        # ==========================================
        # Filters
        # ==========================================

        filterset = ReminderFilter(
            data=request.query_params,
            queryset=reminders,
        )

        if not filterset.is_valid():

            return Response(
                filterset.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        reminders = filterset.qs

        # ==========================================
        # Ordering
        # ==========================================

        ordering = request.query_params.get(
            "ordering"
        )

        allowed_ordering = {
            "due_at",
            "-due_at",

            "created_at",
            "-created_at",

            "completed_at",
            "-completed_at",

            "updated_at",
            "-updated_at",
        }

        if ordering in allowed_ordering:

            reminders = reminders.order_by(
                ordering
            )

        # ==========================================
        # Serializer
        # ==========================================

        serializer = ReminderDetailSerializer(
            reminders,
            many=True
        )

        return Response(
            serializer.data
        )


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