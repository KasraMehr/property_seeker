import csv

from django.http import StreamingHttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import HasRolePermission
from listing.models import Listing
from .models import IngestionRun, IngestionRunItem, ListingSnapshot, ScrapeTarget, TargetListing
from .serializers.serializers import (
    IngestionRunItemSerializer,
    IngestionRunSerializer,
    ListingSnapshotSerializer,
    ScrapeTargetSerializer,
    TargetListingSerializer,
)
from .services.runs import RunAlreadyActive, create_run, resume_run
from .tasks import discover_run, process_run_batch


class ScrapeTargetListCreateView(generics.ListCreateAPIView):
    queryset = ScrapeTarget.objects.select_related("source").all()
    serializer_class = ScrapeTargetSerializer
    permission_classes = (HasRolePermission,)
    @property
    def required_permission(self):
        return (
            "view_scrape_target"
            if self.request.method == "GET"
            else "add_scrape_target"
        )

    def perform_create(self, serializer):
        serializer.save()


class ScrapeTargetDetailView(generics.RetrieveUpdateAPIView):
    queryset = ScrapeTarget.objects.select_related("source").all()
    serializer_class = ScrapeTargetSerializer
    permission_classes = (HasRolePermission,)
    @property
    def required_permission(self):
        return (
            "view_scrape_target"
            if self.request.method == "GET"
            else "change_scrape_target"
        )


class ScrapeTargetTriggerView(APIView):
    permission_classes = (HasRolePermission,)
    required_permission = "run_scrape_target"

    VALID_MODES = {
        IngestionRun.Mode.FULL,
        IngestionRun.Mode.DISCOVERY,
        IngestionRun.Mode.RECONCILIATION,
    }

    def post(self, request, pk):
        target = get_object_or_404(ScrapeTarget, pk=pk)

        mode = request.data.get("mode")
        if mode not in self.VALID_MODES:
            return Response(
                {
                    "detail": (
                        "mode must be one of: full, discovery, reconciliation."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        configuration = request.data.get("configuration") or {}
        if not isinstance(configuration, dict):
            return Response(
                {"detail": "configuration must be an object."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            run = create_run(
                target=target,
                mode=mode,
                configuration=configuration,
            )
        except RunAlreadyActive as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_409_CONFLICT,
            )

        discover_run.delay(str(run.pk))
        return Response(
            IngestionRunSerializer(run).data,
            status=status.HTTP_202_ACCEPTED,
        )


class IngestionRunListView(generics.ListAPIView):
    queryset = IngestionRun.objects.select_related("target", "target__source").all()
    serializer_class = IngestionRunSerializer
    permission_classes = (HasRolePermission,)
    required_permission = "view_ingestion_run"


class IngestionRunDetailView(generics.RetrieveAPIView):
    queryset = IngestionRun.objects.select_related("target", "target__source").all()
    serializer_class = IngestionRunSerializer
    permission_classes = (HasRolePermission,)
    required_permission = "view_ingestion_run"


class IngestionRunItemsView(generics.ListAPIView):
    serializer_class = IngestionRunItemSerializer
    permission_classes = (HasRolePermission,)
    required_permission = "view_ingestion_run"

    def get_queryset(self):
        return (
            IngestionRunItem.objects
            .filter(run_id=self.kwargs["uuid"])
            .select_related("listing", "listing__source")
            .order_by("discovery_order", "id")
        )


class IngestionRunResumeView(APIView):
    permission_classes = (HasRolePermission,)
    required_permission = "run_ingestion_run"

    def post(self, request, uuid):
        run = get_object_or_404(IngestionRun, pk=uuid)
        try:
            run = resume_run(run=run)
        except RunAlreadyActive as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_409_CONFLICT,
            )

        if run.items.exists():
            process_run_batch.delay(str(run.pk))
        else:
            discover_run.delay(str(run.pk))

        return Response(
            IngestionRunSerializer(run).data,
            status=status.HTTP_202_ACCEPTED,
        )


class IngestionRunExportView(APIView):
    permission_classes = (HasRolePermission,)
    required_permission = "export_ingestion_run"

    def get(self, request, uuid):
        run = get_object_or_404(IngestionRun, pk=uuid)
        listings = (
            run.items.filter(listing__isnull=False)
            .select_related("listing")
            .order_by("discovery_order")
        )

        fields = (
            "external_id", "url", "title", "listed_area", "build_year",
            "room_count", "listed_sale_price", "listed_price_per_meter",
            "listed_mortgage_amount", "listed_deposit_amount",
            "listed_rent_amount", "floor_number", "total_floors",
            "pictures_match_property", "media_count", "description",
            "published_at", "source_updated_at", "first_seen_at",
            "last_seen_at", "last_checked_at", "status", "review_status",
        )

        class Echo:
            def write(self, value):
                return value

        def rows():
            writer = csv.writer(Echo())
            yield writer.writerow(fields)
            for item in listings.iterator():
                listing = item.listing
                yield writer.writerow([getattr(listing, field) for field in fields])

        response = StreamingHttpResponse(rows(), content_type="text/csv; charset=utf-8")
        response["Content-Disposition"] = (
            f'attachment; filename="divar_ingestion_{run.pk}.csv"'
        )
        return response


class ListingSnapshotsView(generics.ListAPIView):
    serializer_class = ListingSnapshotSerializer
    permission_classes = (HasRolePermission,)
    required_permission = "view_listing_snapshot"

    def get_queryset(self):
        return (
            ListingSnapshot.objects
            .filter(listing_id=self.kwargs["id"])
            .select_related("listing", "run")
            .order_by("-observed_at")
        )


class ListingTargetsView(generics.ListAPIView):
    serializer_class = TargetListingSerializer
    permission_classes = (HasRolePermission,)
    required_permission = "view_listing_target"

    def get_queryset(self):
        return (
            TargetListing.objects
            .filter(listing_id=self.kwargs["id"])
            .select_related("target", "listing", "listing__source")
            .order_by("-last_seen_at")
        )
