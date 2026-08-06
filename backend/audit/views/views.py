from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from audit.selectors.activity_selectors import *

from audit.serializers.activity_list import ActivityListSerializer
from audit.serializers.activity_detail import ActivityDetailSerializer
from accounts.permissions import *

class ActivityLogListView(APIView):

    permission_classes = [IsAgencyOwner]

    def get(self, request):

        logs = ActivitySelector.all()

        serializer = ActivityListSerializer(
            logs,
            many=True
        )

        return Response(serializer.data)


class ActivityLogDetailView(APIView):

    permission_classes = [IsAgencyOwner]

    def get(self, request, pk):

        log = ActivitySelector.by_id(pk)

        serializer = ActivityDetailSerializer(log)

        return Response(serializer.data)