from django.db.models import Count, Q
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import HasRolePermission
from locations.models import DivarNeighborhood, Zone
from locations.serializers.divar import (
    DivarNeighborhoodSerializer,
    ZoneSerializer,
)
from locations.services import sync_divar_neighborhoods


class ZoneListView(generics.ListAPIView):
    serializer_class = ZoneSerializer
    permission_classes = (HasRolePermission,)
    required_permission = "view_neighborhood"

    def get_queryset(self):
        queryset = Zone.objects.select_related("city").annotate(
            neighborhoods_count=Count("divar_neighborhoods")
        )
        city_slug = self.request.query_params.get("city_slug")
        if city_slug:
            queryset = queryset.filter(city__slug=city_slug)
        city_id = self.request.query_params.get("city")
        if city_id:
            queryset = queryset.filter(city_id=city_id)
        if self.request.query_params.get("active") in {"true", "1"}:
            queryset = queryset.filter(active=True)
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset.order_by("name")


class DivarNeighborhoodListView(generics.ListAPIView):
    serializer_class = DivarNeighborhoodSerializer
    permission_classes = (HasRolePermission,)
    required_permission = "view_neighborhood"

    def get_queryset(self):
        queryset = DivarNeighborhood.objects.select_related("city", "zone")
        city_slug = self.request.query_params.get("city_slug")
        if city_slug:
            queryset = queryset.filter(city__slug=city_slug)
        zone_id = self.request.query_params.get("zone")
        if zone_id:
            queryset = queryset.filter(zone_id=zone_id)
        if self.request.query_params.get("unmapped") in {"true", "1"}:
            queryset = queryset.filter(zone__isnull=True)
        active = self.request.query_params.get("active")
        if active in {"true", "1"}:
            queryset = queryset.filter(active=True)
        elif active in {"false", "0"}:
            queryset = queryset.filter(active=False)
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(normalized_name__icontains=search)
            )
        return queryset.order_by("name")


class DivarNeighborhoodDetailView(generics.RetrieveUpdateAPIView):
    queryset = DivarNeighborhood.objects.select_related("city", "zone")
    serializer_class = DivarNeighborhoodSerializer
    permission_classes = (HasRolePermission,)

    @property
    def required_permission(self):
        return "view_neighborhood" if self.request.method == "GET" else "change_neighborhood"


class DivarNeighborhoodSyncView(APIView):
    permission_classes = (HasRolePermission,)
    required_permission = "change_neighborhood"

    def post(self, request):
        city_slug = request.data.get("city_slug", "fardis")
        try:
            result = sync_divar_neighborhoods(city_slug)
        except DjangoValidationError as error:
            detail = error.message_dict if hasattr(error, "message_dict") else error.messages
            return Response({"detail": detail}, status=status.HTTP_400_BAD_REQUEST)
        except OSError as error:
            return Response(
                {"detail": f"Could not contact Divar: {error}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        return Response(result, status=status.HTTP_200_OK)
