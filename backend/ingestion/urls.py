from django.urls import path

from .views import (
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
    path("targets/", ScrapeTargetListCreateView.as_view(), name="ingestion-target-list"),
    path("targets/<int:pk>/", ScrapeTargetDetailView.as_view(), name="ingestion-target-detail"),
    path("targets/<int:pk>/trigger/", ScrapeTargetTriggerView.as_view(), name="ingestion-target-trigger"),

    path("runs/", IngestionRunListView.as_view(), name="ingestion-run-list"),
    path("runs/<uuid:uuid>/", IngestionRunDetailView.as_view(), name="ingestion-run-detail"),
    path("runs/<uuid:uuid>/items/", IngestionRunItemsView.as_view(), name="ingestion-run-items"),
    path("runs/<uuid:uuid>/resume/", IngestionRunResumeView.as_view(), name="ingestion-run-resume"),
    path("runs/<uuid:uuid>/export/", IngestionRunExportView.as_view(), name="ingestion-run-export"),

    path("listings/<int:id>/snapshots/", ListingSnapshotsView.as_view(), name="listing-snapshots"),
    path("listings/<int:id>/target/", ListingTargetsView.as_view(), name="listing-targets"),
]
