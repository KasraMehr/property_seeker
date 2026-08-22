import hashlib
import json
from dataclasses import dataclass

from django.db import IntegrityError, transaction
from django.utils import timezone

from ingestion.models import IngestionRun, ListingSnapshot, ScrapeTarget, TargetListing
from ingestion.providers.base import ScrapedListing
from listing.models import Listing


@dataclass(frozen=True)
class UpsertResult:
    listing: Listing
    created: bool
    changed: bool
    changed_fields: dict


LISTING_FIELD_MAP = {
    "title": "title",
    "phone": "contact_phone",
    "description": "description",
    "total_price_toman": "listed_sale_price",
    "price_per_meter_toman": "listed_price_per_meter",
    "mortgage_toman": "listed_mortgage_amount",
    "deposit_toman": "listed_deposit_amount",
    "monthly_rent_toman": "listed_rent_amount",
    "area_m2": "listed_area",
    "build_year": "build_year",
    "room_count": "room_count",
    "floor_number": "floor_number",
    "total_floors": "total_floors",
    "pictures_match_property": "pictures_match_property",
    "picture_count": "media_count",
    "source_published_at": "published_at",
    "source_updated_at": "source_updated_at",
}


def canonical_payload(payload):
    data = (
        payload.as_payload() if isinstance(payload, ScrapedListing) else dict(payload)
    )
    return json.loads(json.dumps(data, ensure_ascii=False, sort_keys=True, default=str))


def payload_hash(payload):
    encoded = json.dumps(
        payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    )
    return hashlib.sha256(encoded.encode("utf-8")).hexdigest()


def payload_diff(old_payload, new_payload):
    changed = {}
    for key in sorted(set(old_payload) | set(new_payload)):
        old_value = old_payload.get(key)
        new_value = new_payload.get(key)
        if old_value != new_value:
            changed[key] = {"old": old_value, "new": new_value}
    return changed


@transaction.atomic
def upsert_scraped_listing(
    *,
    payload: ScrapedListing,
    target: ScrapeTarget,
    run: IngestionRun | None = None,
    card_fingerprint: str = "",
):
    now = timezone.now()
    normalized = canonical_payload(payload)
    try:
        with transaction.atomic():
            listing, created = Listing.objects.get_or_create(
                source=target.source,
                external_id=payload.external_id,
                defaults={
                    "title": payload.title,
                    "url": payload.url,
                    "first_seen_at": now,
                },
            )
    except IntegrityError:
        # A concurrent worker may win the unique (source, external_id) insert.
        # Only recover that specific race; all other database failures propagate.
        listing = Listing.objects.get(
            source=target.source,
            external_id=payload.external_id,
        )
        created = False
    listing = Listing.objects.select_for_update().get(pk=listing.pk)

    old_payload = listing.latest_payload or {}
    # Contact reveal can temporarily fail when Divar refreshes auth or applies
    # an anti-abuse challenge. Do not erase a phone number already captured.
    if not normalized.get("phone") and old_payload.get("phone"):
        normalized["phone"] = old_payload["phone"]
    digest = payload_hash(normalized)
    changed_fields = payload_diff(old_payload, normalized)
    changed = created or bool(changed_fields)

    listing.url = payload.url
    for payload_field, model_field in LISTING_FIELD_MAP.items():
        value = getattr(payload, payload_field)
        if payload_field == "phone" and not value and listing.contact_phone:
            continue
        setattr(listing, model_field, value)
    listing.status = Listing.Status.ACTIVE
    listing.last_seen_at = now
    listing.last_checked_at = now
    listing.consecutive_failures = 0
    listing.removal_detected_at = None
    listing.latest_payload = normalized
    listing.content_hash = digest
    if changed:
        listing.last_changed_at = now
    listing.save()

    TargetListing.objects.update_or_create(
        target=target,
        listing=listing,
        defaults={
            "last_seen_at": now,
            **({"last_card_fingerprint": card_fingerprint} if card_fingerprint else {}),
        },
    )
    if changed:
        ListingSnapshot.objects.create(
            listing=listing,
            run=run,
            content_hash=digest,
            payload=normalized,
            changed_fields=changed_fields,
            observed_at=now,
        )
    return UpsertResult(
        listing=listing,
        created=created,
        changed=changed,
        changed_fields=changed_fields,
    )


@transaction.atomic
def record_listing_removed(*, listing: Listing, checked_at=None):
    checked_at = checked_at or timezone.now()
    listing = Listing.objects.select_for_update().get(pk=listing.pk)
    if listing.removal_detected_at is None:
        listing.removal_detected_at = checked_at
        listing.consecutive_failures = 1
    elif (checked_at - listing.removal_detected_at).total_seconds() >= 6 * 60 * 60:
        listing.consecutive_failures = max(2, listing.consecutive_failures + 1)
        listing.status = Listing.Status.EXPIRED
    listing.last_checked_at = checked_at
    listing.save(
        update_fields=[
            "removal_detected_at",
            "consecutive_failures",
            "status",
            "last_checked_at",
            "updated_at",
        ]
    )
    return listing
