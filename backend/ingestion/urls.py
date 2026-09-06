from django.urls import path

from .views import (
    BulkIngestionRunCancelView,
    BulkIngestionRunDeleteView,
    BulkScrapeTargetDeleteView,
    BulkScrapeTargetToggleView,
    DivarLoginConfirmView,
    DivarLoginDetailView,
    DivarLoginStartView,
    DivarSessionCheckView,
    DivarSessionStatusView,
    IngestionRunCancelView,
    IngestionRunDeleteView,
    IngestionRunDetailView,
    IngestionRunExportView,
    IngestionRunItemsView,
    IngestionRunListView,
    IngestionRunResumeView,
    ListingSnapshotsView,
    ListingTargetsView,
    ScrapeTargetDetailView,
    ScrapeTargetListCreateView,
    ScrapeTargetTriggerView,
)

urlpatterns = [
    path(
        "divar-session/",
        DivarSessionStatusView.as_view(),
        name="divar-session-status",
    ),
    path(
        "divar-session/check/",
        DivarSessionCheckView.as_view(),
        name="divar-session-check",
    ),
    path("divar-login/", DivarLoginStartView.as_view(), name="divar-login-start"),
    path(
        "divar-login/<uuid:attempt_id>/",
        DivarLoginDetailView.as_view(),
        name="divar-login-detail",
    ),
    path(
        "divar-login/<uuid:attempt_id>/confirm/",
        DivarLoginConfirmView.as_view(),
        name="divar-login-confirm",
    ),

    path("targets/", ScrapeTargetListCreateView.as_view(), name="ingestion-target-list"),
    path("targets/<int:pk>/", ScrapeTargetDetailView.as_view(), name="ingestion-target-detail"),
    path("targets/<int:pk>/trigger/", ScrapeTargetTriggerView.as_view(), name="ingestion-target-trigger"),
    path("targets/bulk-delete/", BulkScrapeTargetDeleteView.as_view(), name="ingestion-target-bulk-delete"),
    path("targets/bulk-toggle/", BulkScrapeTargetToggleView.as_view(), name="ingestion-target-bulk-toggle"),

    path("runs/", IngestionRunListView.as_view(), name="ingestion-run-list"),
    path("runs/<uuid:uuid>/", IngestionRunDetailView.as_view(), name="ingestion-run-detail"),
    path("runs/<uuid:uuid>/items/", IngestionRunItemsView.as_view(), name="ingestion-run-items"),
    path("runs/<uuid:uuid>/resume/", IngestionRunResumeView.as_view(), name="ingestion-run-resume"),
    path("runs/<uuid:uuid>/cancel/", IngestionRunCancelView.as_view(), name="ingestion-run-cancel"),
    path("runs/<uuid:uuid>/delete/", IngestionRunDeleteView.as_view(), name="ingestion-run-delete"),
    path("runs/bulk-cancel/", BulkIngestionRunCancelView.as_view(), name="ingestion-run-bulk-cancel"),
    path("runs/bulk-delete/", BulkIngestionRunDeleteView.as_view(), name="ingestion-run-bulk-delete"),
    path("runs/<uuid:uuid>/export/", IngestionRunExportView.as_view(), name="ingestion-run-export"),

    path("listings/<int:id>/snapshots/", ListingSnapshotsView.as_view(), name="listing-snapshots"),
    path("listings/<int:id>/target/", ListingTargetsView.as_view(), name="listing-targets"),
]
