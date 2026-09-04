import json
import re
from collections.abc import Callable, Iterable
from urllib.request import Request, urlopen

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from .models import City, DivarNeighborhood
from .normalization import normalize_persian


DIVAR_CATEGORY_SLUGS = (
    "rent-residential",
    "buy-residential",
    "buy-commercial-property",
    "rent-commercial-property",
)
DISTRICT_PATTERN = re.compile(r'"district_persian"\s*:\s*"((?:\\.|[^"\\])*)"')


def _extract_district_names(document: str) -> set[str]:
    names = set()
    for match in DISTRICT_PATTERN.finditer(document or ""):
        try:
            value = json.loads(f'"{match.group(1)}"')
        except json.JSONDecodeError:
            continue
        value = str(value).strip()
        if value:
            names.add(value)
    return names


def fetch_divar_neighborhoods(city_slug: str) -> set[str]:
    """Read canonical district names exposed by Divar's public search pages."""

    headers = {
        "Accept-Language": "fa-IR,fa;q=0.9",
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 Chrome/140 Safari/537.36"
        ),
    }
    names = set()
    for category in DIVAR_CATEGORY_SLUGS:
        request = Request(
            f"https://divar.ir/s/{city_slug}/{category}", headers=headers
        )
        with urlopen(request, timeout=30) as response:
            document = response.read().decode("utf-8", errors="replace")
        names.update(_extract_district_names(document))
    return names


@transaction.atomic
def sync_divar_neighborhoods(
    city_slug: str,
    *,
    fetcher: Callable[[str], Iterable[str]] | None = None,
) -> dict:
    """Synchronize names while preserving all administrator zone mappings."""

    try:
        city = City.objects.get(slug=city_slug)
    except City.DoesNotExist as error:
        raise ValidationError({"city_slug": "Unknown city slug."}) from error

    canonical_names = {
        normalize_persian(name): str(name).strip()
        for name in (fetcher or fetch_divar_neighborhoods)(city_slug)
        if normalize_persian(name)
    }
    if not canonical_names:
        raise ValidationError(
            "Divar returned no neighborhoods; existing data was left unchanged."
        )

    now = timezone.now()
    existing = {
        item.normalized_name: item
        for item in DivarNeighborhood.objects.select_for_update().filter(city=city)
    }
    created_count = 0
    updated_count = 0
    for normalized_name, canonical_name in canonical_names.items():
        item = existing.get(normalized_name)
        if item is None:
            DivarNeighborhood.objects.create(
                city=city,
                name=canonical_name,
                normalized_name=normalized_name,
                zone=None,
                active=True,
                last_seen_at=now,
            )
            created_count += 1
            continue
        changed = item.name != canonical_name or not item.active
        item.name = canonical_name
        item.active = True
        item.last_seen_at = now
        # Intentionally never assign item.zone here.
        item.save()
        updated_count += int(changed)

    missing_names = set(existing) - set(canonical_names)
    deactivated_count = DivarNeighborhood.objects.filter(
        city=city,
        normalized_name__in=missing_names,
        active=True,
    ).update(active=False, updated_at=now)

    return {
        "city_slug": city_slug,
        "received_count": len(canonical_names),
        "created_count": created_count,
        "updated_count": updated_count,
        "deactivated_count": deactivated_count,
        "unmapped_count": DivarNeighborhood.objects.filter(
            city=city, zone__isnull=True, active=True
        ).count(),
    }
