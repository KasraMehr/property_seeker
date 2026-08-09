from django.contrib import admin, messages
from .models import (
    IngestionRun,
    IngestionRunItem,
    ListingSnapshot,
    ScrapeTarget,
    TargetListing,
)
from .services.runs import RunAlreadyActive, create_run, resume_run
from .tasks import discover_run, process_run_batch


class TargetListingInline(admin.TabularInline):
    model = TargetListing
    extra = 0
    readonly_fields = (
        "listing",
        "first_seen_at",
        "last_seen_at",
        "last_seen_full_discovery_at",
        "consecutive_full_absences",
    )


@admin.register(ScrapeTarget)
class ScrapeTargetAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "source",
        "enabled",
        "discovery_interval_minutes",
        "last_discovery_at",
        "last_full_discovery_at",
    )
    list_filter = ("source", "enabled")
    search_fields = ("name", "search_url")
    actions = ("enqueue_full_ingestion", "enqueue_incremental_discovery")

    def _enqueue(self, request, queryset, mode):
        count = 0
        for target in queryset:
            try:
                run = create_run(target=target, mode=mode)
            except RunAlreadyActive:
                self.message_user(
                    request,
                    f"{target}: an active run already exists.",
                    level=messages.WARNING,
                )
                continue
            discover_run.delay(str(run.pk))
            count += 1
        self.message_user(request, f"Queued {count} ingestion run(s).")

    @admin.action(description="Queue full bootstrap ingestion")
    def enqueue_full_ingestion(self, request, queryset):
        self._enqueue(request, queryset, IngestionRun.Mode.FULL)

    @admin.action(description="Queue incremental discovery")
    def enqueue_incremental_discovery(self, request, queryset):
        self._enqueue(request, queryset, IngestionRun.Mode.DISCOVERY)


class IngestionRunItemInline(admin.TabularInline):
    model = IngestionRunItem
    extra = 0
    fields = ("external_id", "status", "retry_count", "listing", "error")
    readonly_fields = fields
    show_change_link = True


@admin.register(IngestionRun)
class IngestionRunAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "target",
        "mode",
        "status",
        "discovered_count",
        "processed_count",
        "new_count",
        "changed_count",
        "failed_count",
        "created_at",
    )
    list_filter = ("mode", "status", "target")
    readonly_fields = [field.name for field in IngestionRun._meta.fields]
    actions = ("resume_incomplete_runs",)
    inlines = (IngestionRunItemInline,)

    @admin.action(description="Resume failed, partial, or interrupted runs")
    def resume_incomplete_runs(self, request, queryset):
        count = 0
        for run in queryset:
            try:
                run = resume_run(run=run)
            except RunAlreadyActive as error:
                self.message_user(request, str(error), level=messages.WARNING)
                continue
            if run.items.exists():
                process_run_batch.delay(str(run.pk))
            else:
                discover_run.delay(str(run.pk))
            count += 1
        self.message_user(request, f"Queued {count} run(s) to resume.")


@admin.register(IngestionRunItem)
class IngestionRunItemAdmin(admin.ModelAdmin):
    list_display = ("external_id", "run", "status", "retry_count", "listing")
    list_filter = ("status", "run__target")
    search_fields = ("external_id", "url", "error")
    readonly_fields = [field.name for field in IngestionRunItem._meta.fields]


@admin.register(ListingSnapshot)
class ListingSnapshotAdmin(admin.ModelAdmin):
    list_display = ("listing", "run", "content_hash", "observed_at")
    search_fields = ("listing__external_id", "listing__title", "content_hash")
    readonly_fields = [field.name for field in ListingSnapshot._meta.fields]


@admin.register(TargetListing)
class TargetListingAdmin(admin.ModelAdmin):
    list_display = ("target", "listing", "last_seen_at", "consecutive_full_absences")
    list_filter = ("target",)
    search_fields = ("listing__external_id", "listing__title")
