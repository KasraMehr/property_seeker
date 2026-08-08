from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from crm.selectors.call_log_selector import CallLogSelector
from crm.filter.filters import CallLogFilter

from crm.serializers.call_log_create import (
    CallLogCreateSerializer
)

from crm.serializers.call_log_list import (
    CallLogListSerializer
)

from crm.serializers.call_log_update import (
    CallLogUpdateSerializer
)


class CallLogListCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        # =========================
        # Base queryset
        # =========================

        calls = CallLogSelector.all(
            request.user
        )

        # =========================
        # Filters
        # =========================

        filterset = CallLogFilter(
            data=request.query_params,
            queryset=calls,
        )

        if not filterset.is_valid():

            return Response(
                filterset.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        calls = filterset.qs

        # =========================
        # Ordering
        # =========================

        ordering = request.query_params.get(
            "ordering"
        )

        allowed_ordering = {
            "called_at",
            "-called_at",
            "created_at",
            "-created_at",
            "call_duration",
            "-call_duration",
            "next_follow_up_at",
            "-next_follow_up_at",
        }

        if ordering in allowed_ordering:

            calls = calls.order_by(
                ordering
            )

        # =========================
        # Serializer
        # =========================

        serializer = CallLogListSerializer(
            calls,
            many=True
        )

        return Response(
            serializer.data
        )

    def post(self, request):

        serializer = CallLogCreateSerializer(
            data=request.data,
            context={
                "request": request
            }
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

        serializer = CallLogListSerializer(
            call
        )

        return Response(
            serializer.data
        )

    def patch(self, request, pk):

        call = CallLogSelector.by_id(
            pk,
            request.user
        )

        serializer = CallLogUpdateSerializer(
            call,
            data=request.data,
            partial=True,
            context={
                "request": request
            }
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            CallLogListSerializer(
                call
            ).data
        )

    def delete(self, request, pk):

        call = CallLogSelector.by_id(
            pk,
            request.user
        )

        call.is_deleted = True
        call.save(
            update_fields=["is_deleted"]
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )
