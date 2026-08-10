from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from crm.filter.filters import CallLogFilter
from crm.selectors.call_log_selector import CallLogSelector
from crm.serializers.call_log_create import CallLogCreateSerializer
from crm.serializers.call_log_list import CallLogListSerializer
from crm.serializers.call_log_update import CallLogUpdateSerializer
from accounts.permissions import *

class CallLogListCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        # =========================
        # Base queryset
        # =========================

        calls = CallLogSelector.all(request.user)

        # =========================
        # Filters
        # =========================

        filterset = CallLogFilter(
            data=request.query_params,
            queryset=calls,
        )

        if not filterset.is_valid():

            return Response(filterset.errors, status=status.HTTP_400_BAD_REQUEST)

        calls = filterset.qs

        # =========================
        # Ordering
        # =========================

        ordering = request.query_params.get("ordering")

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

            calls = calls.order_by(ordering)

        # =========================
        # Serializer
        # =========================

        serializer = CallLogListSerializer(calls, many=True)

        return Response(serializer.data)

    def post(self, request):

        serializer = CallLogCreateSerializer(
            data=request.data, context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        call = serializer.save()

        return Response(
            CallLogListSerializer(call).data, status=status.HTTP_201_CREATED
        )


class CallLogDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        call = CallLogSelector.by_id(pk, request.user)

        serializer = CallLogListSerializer(call)

        return Response(serializer.data)

    def update(self, request, pk):

        call = CallLogSelector.by_id(pk, request.user)

        serializer = CallLogUpdateSerializer(
            call, data=request.data, partial=True, context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(CallLogListSerializer(call).data)


class CallLogBulkDeleteView(APIView):
        permission_classes = (
            IsAuthenticated,
            HasRolePermission,
        )

        required_permission = "delete_call_log"

        def delete(self, request):
            call_ids = request.data.get("ids", [])

            if not call_ids:
                return Response(
                    {"message": "حداقل یک تماس را انتخاب کنید."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            deleted_count = 0

            for call_id in call_ids:
                call = CallLogSelector.by_id(
                    call_id,
                    request.user,
                )

                call.is_deleted = True
                call.save(update_fields=["is_deleted"])

                deleted_count += 1

            return Response(
                {
                    "message": f"{deleted_count} تماس با موفقیت حذف شد.",
                    "deleted_count": deleted_count,
                },
                status=status.HTTP_200_OK,
            )