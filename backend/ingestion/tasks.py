import logging

from celery import shared_task
from django.db.models import Count, Q
from django.utils import timezone

from ingestion.models import IngestionRun, IngestionRunItem, ScrapeTarget
from ingestion.provider_factory import create_divar_provider
from ingestion.providers.divar import ListingRemoved, RateLimitDetected
from ingestion.providers.divar.provider import ProviderError
from ingestion.services.persistence import (
    record_listing_removed,
    upsert_scraped_listing,
)
from ingestion.services.runs import (
    RunAlreadyActive,
    build_refresh_run,
    create_run,
    populate_discovery_run,
)
from listing.models import Listing

logger = logging.getLogger(__name__)
BATCH_SIZE = 50
MAX_ITEM_ATTEMPTS = 3


def refresh_run_counters(run):
    items = run.items.all()
    aggregate = items.aggregate(
        processed=Count(
            "id",
            filter=Q(
                status__in=[
                    IngestionRunItem.Status.SUCCEEDED,
                    IngestionRunItem.Status.REMOVED,
                    IngestionRunItem.Status.FAILED,
                ]
            ),
        ),
        created=Count("id", filter=Q(created_listing=True)),
        changed=Count("id", filter=Q(changed=True)),
        failed=Count("id", filter=Q(status=IngestionRunItem.Status.FAILED)),
        removed=Count("id", filter=Q(status=IngestionRunItem.Status.REMOVED)),
        remaining=Count(
            "id",
            filter=Q(
                status__in=[
                    IngestionRunItem.Status.PENDING,
                    IngestionRunItem.Status.RUNNING,
                ]
            ),
        ),
    )
    run.processed_count = aggregate["processed"]
    run.new_count = aggregate["created"]
    run.changed_count = aggregate["changed"]
    run.failed_count = aggregate["failed"]
    run.removed_count = aggregate["removed"]
    if aggregate["remaining"] == 0:
        run.finished_at = timezone.now()
        run.status = (
            IngestionRun.Status.PARTIAL
            if aggregate["failed"]
            else IngestionRun.Status.SUCCEEDED
        )
    run.save(
        update_fields=[
            "processed_count",
            "new_count",
            "changed_count",
            "failed_count",
            "removed_count",
            "finished_at",
            "status",
        ]
    )
    return aggregate


@shared_task(queue="scraping", acks_late=True)
def discover_run(run_id, enqueue_details=True):
    run = IngestionRun.objects.select_related("target__source").get(pk=run_id)
    if run.status not in {IngestionRun.Status.QUEUED, IngestionRun.Status.RUNNING}:
        return str(run.pk)
    run.status = IngestionRun.Status.RUNNING
    run.started_at = run.started_at or timezone.now()
    run.save(update_fields=["status", "started_at"])
    provider = create_divar_provider()
    known_ids = set(
        Listing.objects.filter(source=run.target.source).values_list(
            "external_id", flat=True
        )
    )
    full = run.mode in {IngestionRun.Mode.FULL, IngestionRun.Mode.RECONCILIATION}
    try:
        discovered = provider.discover(
            run.target.search_url,
            full=full,
            known_external_ids=known_ids,
            known_streak=run.target.incremental_known_streak,
            max_cards=run.target.incremental_max_cards,
        )
        populate_discovery_run(run=run, discovered=discovered)
    except Exception as error:
        logger.exception("Discovery failed for run %s", run.pk)
        run.status = IngestionRun.Status.FAILED
        run.error_summary = str(error)
        run.finished_at = timezone.now()
        run.save(update_fields=["status", "error_summary", "finished_at"])
        raise

    if (
        enqueue_details
        and run.items.filter(status=IngestionRunItem.Status.PENDING).exists()
    ):
        process_run_batch.delay(str(run.pk))
    elif not run.items.filter(status=IngestionRunItem.Status.PENDING).exists():
        refresh_run_counters(run)
    return str(run.pk)


@shared_task(queue="scraping", acks_late=True)
def process_run_batch(run_id, batch_size=BATCH_SIZE, enqueue_next=True):
    run = IngestionRun.objects.select_related("target__source").get(pk=run_id)
    if run.status not in {IngestionRun.Status.RUNNING, IngestionRun.Status.QUEUED}:
        return str(run.pk)
    items = list(
        run.items.filter(status=IngestionRunItem.Status.PENDING)
        .select_related("listing")
        .order_by("discovery_order", "id")[:batch_size]
    )
    if not items:
        refresh_run_counters(run)
        return str(run.pk)

    provider = create_divar_provider()
    with provider.session() as driver:
        for item in items:
            item.status = IngestionRunItem.Status.RUNNING
            item.started_at = timezone.now()
            item.error = ""
            item.save(update_fields=["status", "started_at", "error"])
            try:
                payload = provider.fetch_listing(item.url, driver=driver)
                result = upsert_scraped_listing(
                    payload=payload,
                    target=run.target,
                    run=run,
                    card_fingerprint=item.card_fingerprint,
                )
                item.listing = result.listing
                item.created_listing = result.created
                item.changed = result.changed
                item.status = IngestionRunItem.Status.SUCCEEDED
            except ListingRemoved as error:
                if item.listing_id:
                    record_listing_removed(listing=item.listing)
                item.status = IngestionRunItem.Status.REMOVED
                item.error = str(error)
            except RateLimitDetected as error:
                item.retry_count += 1
                provider.limiter.block(20 * (2 ** (item.retry_count - 1)))
                item.status = (
                    IngestionRunItem.Status.PENDING
                    if item.retry_count < MAX_ITEM_ATTEMPTS
                    else IngestionRunItem.Status.FAILED
                )
                item.error = str(error)
            except ProviderError as error:
                item.retry_count += 1
                provider.limiter.block(5 * (2 ** (item.retry_count - 1)))
                item.status = (
                    IngestionRunItem.Status.PENDING
                    if item.retry_count < MAX_ITEM_ATTEMPTS
                    else IngestionRunItem.Status.FAILED
                )
                item.error = str(error)
            except Exception as error:
                logger.exception("Unexpected detail failure for %s", item.external_id)
                item.retry_count += 1
                item.status = (
                    IngestionRunItem.Status.PENDING
                    if item.retry_count < MAX_ITEM_ATTEMPTS
                    else IngestionRunItem.Status.FAILED
                )
                item.error = str(error)
            item.finished_at = (
                timezone.now()
                if item.status != IngestionRunItem.Status.PENDING
                else None
            )
            item.save(
                update_fields=[
                    "listing",
                    "created_listing",
                    "changed",
                    "status",
                    "retry_count",
                    "error",
                    "finished_at",
                ]
            )

    aggregate = refresh_run_counters(run)
    if enqueue_next and aggregate["remaining"]:
        process_run_batch.apply_async(args=[str(run.pk)], countdown=2)
    return str(run.pk)


def process_run_synchronously(run_id, batch_size=BATCH_SIZE):
    """Process a run without requiring Redis/Celery, primarily for operators."""
    while IngestionRunItem.objects.filter(
        run_id=run_id,
        status=IngestionRunItem.Status.PENDING,
    ).exists():
        process_run_batch.run(str(run_id), batch_size=batch_size, enqueue_next=False)
    return str(run_id)


@shared_task(queue="default")
def dispatch_incremental_discovery():
    started = []
    now = timezone.now()
    for target in ScrapeTarget.objects.filter(enabled=True):
        if (
            target.last_discovery_at
            and (now - target.last_discovery_at).total_seconds()
            < target.discovery_interval_minutes * 60
        ):
            continue
        try:
            run = create_run(target=target, mode=IngestionRun.Mode.DISCOVERY)
        except RunAlreadyActive:
            continue
        discover_run.delay(str(run.pk))
        started.append(str(run.pk))
    return started


@shared_task(queue="default")
def dispatch_due_refreshes():
    started = []
    for target in ScrapeTarget.objects.filter(enabled=True):
        try:
            run = build_refresh_run(target=target)
        except RunAlreadyActive:
            continue
        if run:
            process_run_batch.delay(str(run.pk))
            started.append(str(run.pk))
    return started


@shared_task(queue="default")
def dispatch_daily_reconciliation():
    started = []
    for target in ScrapeTarget.objects.filter(enabled=True):
        try:
            run = create_run(target=target, mode=IngestionRun.Mode.RECONCILIATION)
        except RunAlreadyActive:
            continue
        discover_run.delay(str(run.pk))
        started.append(str(run.pk))
    return started
