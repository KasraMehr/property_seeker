import uuid

from django.db import models
from django.db.models import Q
from django.utils import timezone


class ScrapeTarget(models.Model):
    source = models.ForeignKey(
        "listing.Source",
        on_delete=models.PROTECT,
        related_name="scrape_targets",
    )
    name = models.CharField(max_length=150)
    search_url = models.URLField(max_length=1000, unique=True)
    enabled = models.BooleanField(default=True, db_index=True)
    discovery_interval_minutes = models.PositiveSmallIntegerField(default=15)
    incremental_known_streak = models.PositiveSmallIntegerField(default=100)
    incremental_max_cards = models.PositiveSmallIntegerField(default=500)
    last_watermark_external_id = models.CharField(max_length=100, blank=True)
    last_discovery_at = models.DateTimeField(null=True, blank=True)
    last_full_discovery_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    listings = models.ManyToManyField(
        "listing.Listing",
        through="TargetListing",
        related_name="scrape_targets",
    )

    class Meta:
        db_table = "scrape_targets"
        ordering = ["name"]

    def __str__(self):
        return self.name


class IngestionRun(models.Model):
    class Mode(models.TextChoices):
        FULL = "full", "Full bootstrap"
        DISCOVERY = "discovery", "Incremental discovery"
        REFRESH = "refresh", "Scheduled refresh"
        RECONCILIATION = "reconciliation", "Full token reconciliation"

    class Status(models.TextChoices):
        QUEUED = "queued", "Queued"
        RUNNING = "running", "Running"
        SUCCEEDED = "succeeded", "Succeeded"
        PARTIAL = "partial", "Partial"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    target = models.ForeignKey(
        ScrapeTarget,
        on_delete=models.PROTECT,
        related_name="runs",
    )
    mode = models.CharField(max_length=20, choices=Mode.choices)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.QUEUED,
        db_index=True,
    )
    configuration = models.JSONField(default=dict, blank=True)
    discovered_count = models.PositiveIntegerField(default=0)
    queued_count = models.PositiveIntegerField(default=0)
    processed_count = models.PositiveIntegerField(default=0)
    new_count = models.PositiveIntegerField(default=0)
    changed_count = models.PositiveIntegerField(default=0)
    failed_count = models.PositiveIntegerField(default=0)
    removed_count = models.PositiveIntegerField(default=0)
    error_summary = models.TextField(blank=True)
    artifact_path = models.CharField(max_length=1000, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ingestion_runs"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["target"],
                condition=Q(status__in=["queued", "running"]),
                name="one_active_ingestion_run_per_target",
            ),
        ]
        indexes = [
            models.Index(fields=["target", "mode", "created_at"]),
            models.Index(fields=["status", "created_at"]),
        ]

    def __str__(self):
        return f"{self.target} / {self.mode} / {self.status}"


class IngestionRunItem(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        RUNNING = "running", "Running"
        SUCCEEDED = "succeeded", "Succeeded"
        FAILED = "failed", "Failed"
        REMOVED = "removed", "Removed"
        SKIPPED = "skipped", "Skipped"

    run = models.ForeignKey(
        IngestionRun,
        on_delete=models.CASCADE,
        related_name="items",
    )
    listing = models.ForeignKey(
        "listing.Listing",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ingestion_items",
    )
    external_id = models.CharField(max_length=100)
    url = models.URLField(max_length=1000)
    discovery_order = models.PositiveIntegerField(default=0)
    card_fingerprint = models.CharField(max_length=64, blank=True)
    card_payload = models.JSONField(default=dict, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )
    retry_count = models.PositiveSmallIntegerField(default=0)
    created_listing = models.BooleanField(default=False)
    changed = models.BooleanField(default=False)
    error = models.TextField(blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "ingestion_run_items"
        ordering = ["discovery_order", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["run", "external_id"],
                name="unique_ingestion_run_external_id",
            ),
        ]
        indexes = [
            models.Index(fields=["run", "status"]),
        ]


class TargetListing(models.Model):
    target = models.ForeignKey(
        ScrapeTarget,
        on_delete=models.CASCADE,
        related_name="listing_memberships",
    )
    listing = models.ForeignKey(
        "listing.Listing",
        on_delete=models.CASCADE,
        related_name="target_memberships",
    )
    first_seen_at = models.DateTimeField(default=timezone.now)
    last_seen_at = models.DateTimeField(default=timezone.now, db_index=True)
    last_seen_full_discovery_at = models.DateTimeField(null=True, blank=True)
    consecutive_full_absences = models.PositiveSmallIntegerField(default=0)
    last_card_fingerprint = models.CharField(max_length=64, blank=True)

    class Meta:
        db_table = "target_listings"
        constraints = [
            models.UniqueConstraint(
                fields=["target", "listing"],
                name="unique_target_listing",
            ),
        ]
        indexes = [
            models.Index(fields=["target", "last_seen_at"]),
        ]


class ListingSnapshot(models.Model):
    listing = models.ForeignKey(
        "listing.Listing",
        on_delete=models.CASCADE,
        related_name="snapshots",
    )
    run = models.ForeignKey(
        IngestionRun,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="snapshots",
    )
    content_hash = models.CharField(max_length=64, db_index=True)
    payload = models.JSONField(default=dict)
    changed_fields = models.JSONField(default=dict, blank=True)
    observed_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        db_table = "listing_snapshots"
        ordering = ["-observed_at"]
        indexes = [
            models.Index(fields=["listing", "observed_at"]),
        ]
