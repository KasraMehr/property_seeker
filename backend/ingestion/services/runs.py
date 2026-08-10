from datetime import timedelta

from django.db import IntegrityError, models, transaction
from django.db.models import Q
from django.utils import timezone

from ingestion.models import IngestionRun, IngestionRunItem, TargetListing
from listing.models import Listing


class RunAlreadyActive(RuntimeError):
    pass


def listing_refresh_due(listing, now=None):
    now = now or timezone.now()
    if listing.status != Listing.Status.ACTIVE:
        return False
    if listing.last_checked_at is None:
        return True
    if listing.review_status in {
        Listing.ReviewStatus.SHORTLISTED,
        Listing.ReviewStatus.PROMOTED,
    }:
        interval = timedelta(hours=2)
    elif listing.first_seen_at >= now - timedelta(hours=72):
        interval = timedelta(hours=6)
    elif listing.first_seen_at >= now - timedelta(days=30):
        interval = timedelta(hours=24)
    else:
        interval = timedelta(hours=72)
    return listing.last_checked_at <= now - interval


def create_run(*, target, mode, configuration=None):
    try:
        with transaction.atomic():
            return IngestionRun.objects.create(
                target=target,
                mode=mode,
                configuration=configuration or {},
            )
    except IntegrityError as error:
        raise RunAlreadyActive(
            f"Target {target.pk} already has an active run"
        ) from error


@transaction.atomic
def populate_discovery_run(*, run, discovered):
    run = (
        IngestionRun.objects.select_for_update()
        .select_related("target__source")
        .get(pk=run.pk)
    )
    now = timezone.now()
    target = run.target
    tokens = [item.external_id for item in discovered]
    existing = {
        listing.external_id: listing
        for listing in Listing.objects.filter(
            source=target.source, external_id__in=tokens
        )
    }
    memberships = {
        membership.listing_id: membership
        for membership in TargetListing.objects.filter(
            target=target,
            listing_id__in=[listing.pk for listing in existing.values()],
        )
    }
    full_detail = run.mode == IngestionRun.Mode.FULL
    detail_limit = run.configuration.get("detail_limit")
    run_items = []
    seen_listing_ids = []
    queued_count = 0
    for item in discovered:
        listing = existing.get(item.external_id)
        membership = memberships.get(listing.pk) if listing else None
        card_changed = bool(
            listing
            and item.card_fingerprint
            and (
                not membership
                or membership.last_card_fingerprint != item.card_fingerprint
            )
        )
        within_detail_limit = detail_limit is None or item.position < int(detail_limit)
        should_fetch = within_detail_limit and (
            not listing
            or full_detail
            or card_changed
            or listing_refresh_due(listing, now)
        )
        status = (
            IngestionRunItem.Status.PENDING
            if should_fetch
            else IngestionRunItem.Status.SKIPPED
        )
        queued_count += int(should_fetch)
        run_items.append(
            IngestionRunItem(
                run=run,
                listing=listing,
                external_id=item.external_id,
                url=item.url,
                discovery_order=item.position,
                card_fingerprint=item.card_fingerprint,
                card_payload=item.card_payload,
                status=status,
                finished_at=now if status == IngestionRunItem.Status.SKIPPED else None,
            )
        )
        if listing:
            seen_listing_ids.append(listing.pk)
            listing.last_seen_at = now
            listing.save(update_fields=["last_seen_at", "updated_at"])
            TargetListing.objects.update_or_create(
                target=target,
                listing=listing,
                defaults={
                    "last_seen_at": now,
                    "last_seen_full_discovery_at": (
                        now
                        if run.mode
                        in {IngestionRun.Mode.FULL, IngestionRun.Mode.RECONCILIATION}
                        else (
                            membership.last_seen_full_discovery_at
                            if membership
                            else None
                        )
                    ),
                    "consecutive_full_absences": 0,
                    "last_card_fingerprint": item.card_fingerprint,
                },
            )

    IngestionRunItem.objects.bulk_create(run_items, ignore_conflicts=True)
    if run.mode in {IngestionRun.Mode.FULL, IngestionRun.Mode.RECONCILIATION}:
        TargetListing.objects.filter(target=target).exclude(
            listing_id__in=seen_listing_ids
        ).update(consecutive_full_absences=models.F("consecutive_full_absences") + 1)
        target.last_full_discovery_at = now
    target.last_discovery_at = now
    target.last_watermark_external_id = (
        tokens[0] if tokens else target.last_watermark_external_id
    )
    target.save(
        update_fields=[
            "last_discovery_at",
            "last_full_discovery_at",
            "last_watermark_external_id",
            "updated_at",
        ]
    )
    run.discovered_count = len(discovered)
    run.queued_count = queued_count
    run.status = IngestionRun.Status.RUNNING
    run.started_at = run.started_at or now
    run.save(update_fields=["discovered_count", "queued_count", "status", "started_at"])
    return run


@transaction.atomic
def resume_run(*, run):
    run = IngestionRun.objects.select_for_update().get(pk=run.pk)
    if run.status in {IngestionRun.Status.QUEUED, IngestionRun.Status.RUNNING}:
        raise RunAlreadyActive(f"Run {run.pk} is already active")
    active = IngestionRun.objects.filter(
        target=run.target,
        status__in=[IngestionRun.Status.QUEUED, IngestionRun.Status.RUNNING],
    ).exclude(pk=run.pk)
    if active.exists():
        raise RunAlreadyActive(f"Target {run.target_id} already has an active run")
    run.items.filter(
        status__in=[IngestionRunItem.Status.FAILED, IngestionRunItem.Status.RUNNING]
    ).update(
        status=IngestionRunItem.Status.PENDING,
        retry_count=0,
        error="",
        started_at=None,
        finished_at=None,
    )
    run.status = IngestionRun.Status.QUEUED
    run.finished_at = None
    run.error_summary = ""
    run.save(update_fields=["status", "finished_at", "error_summary"])
    return run


def build_refresh_run(*, target, limit=500):
    now = timezone.now()
    candidates = (
        Listing.objects.filter(
            target_memberships__target=target, status=Listing.Status.ACTIVE
        )
        .filter(
            Q(last_checked_at__isnull=True)
            | Q(
                review_status__in=[
                    Listing.ReviewStatus.SHORTLISTED,
                    Listing.ReviewStatus.PROMOTED,
                ],
                last_checked_at__lte=now - timedelta(hours=2),
            )
            | Q(
                first_seen_at__gte=now - timedelta(hours=72),
                last_checked_at__lte=now - timedelta(hours=6),
            )
            | Q(
                first_seen_at__gte=now - timedelta(days=30),
                first_seen_at__lt=now - timedelta(hours=72),
                last_checked_at__lte=now - timedelta(hours=24),
            )
            | Q(
                first_seen_at__lt=now - timedelta(days=30),
                last_checked_at__lte=now - timedelta(hours=72),
            )
        )
        .order_by("last_checked_at", "pk")
        .distinct()[:limit]
    )
    listings = list(candidates)
    if not listings:
        return None
    run = create_run(
        target=target, mode=IngestionRun.Mode.REFRESH, configuration={"limit": limit}
    )
    IngestionRunItem.objects.bulk_create(
        [
            IngestionRunItem(
                run=run,
                listing=listing,
                external_id=listing.external_id,
                url=listing.url,
                discovery_order=index,
            )
            for index, listing in enumerate(listings)
        ]
    )
    run.status = IngestionRun.Status.RUNNING
    run.started_at = now
    run.discovered_count = len(listings)
    run.queued_count = len(listings)
    run.save(update_fields=["status", "started_at", "discovered_count", "queued_count"])
    return run
