from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from crm.selectors.call_log_selector import CallLogSelector

from crm.serializers.call_log_create import CallLogCreateSerializer
from crm.serializers.call_log_list import CallLogListSerializer
from crm.serializers.call_log_update import *


class CallLogListCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        calls = CallLogSelector.all(request.user)

        serializer = CallLogListSerializer(
            calls,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):

        serializer = CallLogCreateSerializer(
            data=request.data,
            context={"request": request}
        )

        serializer.is_valid(
            raise_exception=True
        )

        call = serializer.save()

        return Response(
            CallLogListSerializer(call).data,
            status=status.HTTP_201_CREATED
        )


class CallLogDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        call = CallLogSelector.by_id(
            pk,
            request.user
        )

        serializer = CallLogListSerializer(call)

        return Response(serializer.data)

    def patch(self, request, pk):

        call = CallLogSelector.by_id(
            pk,
            request.user
        )

        serializer = CallLogUpdateSerializer(
            call,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(serializer.data)

    def delete(self, request, pk):

        call = CallLogSelector.by_id(
            pk,
            request.user
        )

        call.is_deleted = True
        call.save()

        return Response(status=204)