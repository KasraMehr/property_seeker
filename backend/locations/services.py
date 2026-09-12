import json
import re
import time
from collections.abc import Callable, Iterable
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from django.core.cache import cache
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

# District names are identical across category pages, so one successful page
# is enough. Cache them to keep Divar request volume minimal.
NEIGHBORHOOD_CACHE_TTL = 60 * 60 * 24  # 24 hours
# Pauses before retries when Divar throttles us (429 / 5xx / network errors)
RETRY_DELAYS = (2, 6, 15)
MAX_RETRY_AFTER = 60


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


def _retry_delay_for(error: HTTPError, attempt: int) -> int:
    """Seconds to wait before the next attempt (honours Retry-After when set)."""
    retry_after = error.headers.get("Retry-After") if error.headers else None
    if retry_after:
        try:
            return min(int(float(retry_after)), MAX_RETRY_AFTER)
        except (TypeError, ValueError):
            pass
    return RETRY_DELAYS[min(attempt, len(RETRY_DELAYS) - 1)]


def _fetch_divar_document(url: str, headers: dict) -> str:
    """Fetch one Divar page, retrying throttled/failed attempts with backoff."""
    last_error: Exception | None = None
    for attempt in range(len(RETRY_DELAYS) + 1):
        if attempt:
            delay = (
                _retry_delay_for(last_error, attempt - 1)
                if isinstance(last_error, HTTPError)
                else RETRY_DELAYS[min(attempt - 1, len(RETRY_DELAYS) - 1)]
            )
            time.sleep(delay)
        try:
            request = Request(url, headers=headers)
            with urlopen(request, timeout=30) as response:
                return response.read().decode("utf-8", errors="replace")
        except HTTPError as error:
            last_error = error
            if error.code != 429 and error.code < 500:
                raise  # permanent client error — retrying won't help
        except OSError as error:  # network errors / timeouts
            last_error = error
    raise last_error


def fetch_divar_neighborhoods(city_slug: str) -> set[str]:
    """Read canonical district names exposed by Divar's public search pages.

    Results are cached for 24 hours; only the first category page that yields
    names is fetched (district names are the same across categories).
    """

    cache_key = f"divar_neighborhoods:{city_slug}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    headers = {
        "Accept-Language": "fa-IR,fa;q=0.9",
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 Chrome/140 Safari/537.36"
        ),
    }
    names: set[str] = set()
    for category in DIVAR_CATEGORY_SLUGS:
        try:
            document = _fetch_divar_document(
                f"https://divar.ir/s/{city_slug}/{category}", headers
            )
        except OSError:
            # Keep whatever earlier categories already produced; only fail
            # when nothing was fetched at all.
            if names:
                break
            raise
        names.update(_extract_district_names(document))
        if names:
            break  # one page is enough
        time.sleep(2)  # pause before falling back to the next category

    if names:
        cache.set(cache_key, names, NEIGHBORHOOD_CACHE_TTL)
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
