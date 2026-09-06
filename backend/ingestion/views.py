import csv

from django.http import StreamingHttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import HasRolePermission

from .models import (
    IngestionRun,
    IngestionRunItem,
    ListingSnapshot,
    ScrapeTarget,
    TargetListing,
)
from .serializers.serializers import (
    DivarLoginOtpSerializer,
    DivarLoginStartSerializer,
    IngestionRunItemSerializer,
    IngestionRunSerializer,
    ListingSnapshotSerializer,
    ScrapeTargetSerializer,
    ScrapeTargetBundleCreateSerializer,
    TargetListingSerializer,
)
from .services.divar_login import (
    DivarLoginAttemptActive,
    DivarLoginAttemptError,
    DivarLoginAttemptNotFound,
    create_attempt,
    get_attempt,
    submit_otp,
)
from .services.divar_session import (
    DivarSessionRequired,
    begin_session_check,
    get_session_state,
    set_session_state,
)
from .services.runs import RunAlreadyActive, create_run, resume_run
from .services.targets import create_category_targets
from .tasks import (
    authenticate_divar_session,
    check_divar_session,
    discover_run,
    process_run_batch,
)


class DivarSessionStatusView(APIView):
    permission_classes = (HasRolePermission,)
    required_permission = "run_scrape_target"

    def get(self, request):
        return Response(get_session_state())


class DivarSessionCheckView(APIView):
    permission_classes = (HasRolePermission,)
    required_permission = "run_scrape_target"

    def post(self, request):
        if begin_session_check():
            check_divar_session.delay()
        return Response(get_session_state(), status=status.HTTP_202_ACCEPTED)


class DivarLoginStartView(APIView):
    permission_classes = (HasRolePermission,)
    required_permission = "run_scrape_target"

    def post(self, request):
        serializer = DivarLoginStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data["phone"]
        try:
            attempt = create_attempt(phone)
        except DivarLoginAttemptActive as error:
            return Response(
                get_attempt(error.attempt_id),
                status=status.HTTP_409_CONFLICT,
            )
        set_session_state(
            "authenticating",
            "Divar login is queued on the scraper worker.",
            phone_masked=attempt["phone_masked"],
        )
        authenticate_divar_session.delay(attempt["id"], phone)
        return Response(attempt, status=status.HTTP_202_ACCEPTED)


class DivarLoginDetailView(APIView):
    permission_classes = (HasRolePermission,)
    required_permission = "run_scrape_target"

    def get(self, request, attempt_id):
        try:
            attempt = get_attempt(attempt_id)
        except DivarLoginAttemptNotFound as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(attempt)


class DivarLoginConfirmView(APIView):
    permission_classes = (HasRolePermission,)
    required_permission = "run_scrape_target"

    def post(self, request, attempt_id):
        serializer = DivarLoginOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            attempt = submit_otp(
                attempt_id,
                serializer.validated_data["otp"],
            )
        except DivarLoginAttemptNotFound as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_404_NOT_FOUND,
            )
        except DivarLoginAttemptError as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(attempt, status=status.HTTP_202_ACCEPTED)


class ScrapeTargetListCreateView(generics.ListCreateAPIView):
    queryset = ScrapeTarget.objects.select_related("source", "zone__city").all()
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

    def post(self, request, *args, **kwargs):
        # The UI submits one location-aware base URL. Keep the legacy single
        # target payload working for CLI/API clients that still send search_url.
        if request.data.get("base_url") and not request.data.get("search_url"):
            serializer = ScrapeTargetBundleCreateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = dict(serializer.validated_data)
            source = data.pop("source")
            name = data.pop("name")
            base_url = data.pop("base_url")
            zone = data.pop("zone")
            targets = create_category_targets(
                source=source,
                name=name,
                base_url=base_url,
                zone=zone,
                **data,
            )
            return Response(
                {
                    "created_count": len(targets),
                    "targets": ScrapeTargetSerializer(targets, many=True).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return super().post(request, *args, **kwargs)


class ScrapeTargetDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ScrapeTarget.objects.select_related("source", "zone__city").all()
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
        except DivarSessionRequired as exc:
            return Response(
                {
                    "code": "divar_session_required",
                    "detail": str(exc),
                    "session": get_session_state(),
                },
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
        except DivarSessionRequired as exc:
            return Response(
                {
                    "code": "divar_session_required",
                    "detail": str(exc),
                    "session": get_session_state(),
                },
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


class IngestionRunCancelView(APIView):
    permission_classes = (HasRolePermission,)
    required_permission = "run_ingestion_run"

    def post(self, request, uuid):
        run = get_object_or_404(IngestionRun, pk=uuid)
        if run.status not in {IngestionRun.Status.QUEUED, IngestionRun.Status.RUNNING}:
            return Response(
                {"detail": "Only queued or running runs can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        run.status = IngestionRun.Status.CANCELLED
        run.finished_at = timezone.now()
        run.error_summary = "Cancelled by user."
        run.save(update_fields=["status", "finished_at", "error_summary"])
        return Response(IngestionRunSerializer(run).data)


class IngestionRunDeleteView(APIView):
    permission_classes = (HasRolePermission,)
    required_permission = "run_ingestion_run"

    def delete(self, request, uuid):
        run = get_object_or_404(IngestionRun, pk=uuid)
        if run.status in {IngestionRun.Status.QUEUED, IngestionRun.Status.RUNNING}:
            return Response(
                {"detail": "Cannot delete a queued or running run. Cancel it first."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        run.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class IngestionRunExportView(APIView):
    permission_classes = (HasRolePermission,)
    required_permission = "export_ingestion_run"

    def get(self, request, uuid):
        run = get_object_or_404(IngestionRun, pk=uuid)
        listings = (
            run.items.filter(listing__isnull=False)
            .select_related("listing", "listing__divar_neighborhood__zone")
            .order_by("discovery_order")
        )

        fields = (
            "external_id", "url", "title", "category", "zone",
            "divar_neighborhood", "listed_area", "build_year",
            "contact_phone",
            "room_count", "listed_sale_price", "listed_price_per_meter",
            "listed_mortgage_amount", "listed_deposit_amount",
            "listed_rent_amount", "floor_number", "total_floors",
            "pictures_match_property", "media_count", "description",
            "advertiser_type", "advertiser_classification_status",
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
                values = []
                for field in fields:
                    if field == "zone":
                        value = (
                            listing.divar_neighborhood.zone.name
                            if listing.divar_neighborhood_id
                            and listing.divar_neighborhood.zone_id
                            else ""
                        )
                    elif field == "divar_neighborhood":
                        value = (
                            listing.divar_neighborhood.name
                            if listing.divar_neighborhood_id
                            else ""
                        )
                    else:
                        value = getattr(listing, field)
                    values.append(value)
                yield writer.writerow(values)

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
