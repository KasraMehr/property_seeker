from urllib.parse import urlsplit, urlunsplit

from django.core.exceptions import ValidationError
from django.db import transaction

from ingestion.models import ScrapeTarget


DIVAR_CATEGORY_SLUGS = tuple(value for value, _ in ScrapeTarget.ListingCategory.choices)


def normalize_divar_base_url(value: str) -> tuple[str, str]:
    """Return a category-free Divar search URL and its city slug."""

    parsed = urlsplit(str(value or "").strip())
    if parsed.scheme not in {"http", "https"} or parsed.hostname not in {
        "divar.ir",
        "www.divar.ir",
    }:
        raise ValidationError("Enter a valid divar.ir search URL.")

    parts = [part for part in parsed.path.split("/") if part]
    if len(parts) < 2 or parts[0] != "s":
        raise ValidationError("The URL must be a Divar city search URL (/s/<city>[/...]).")
    city_slug = parts[1]
    if len(parts) > 2 and parts[2] not in DIVAR_CATEGORY_SLUGS:
        raise ValidationError("The URL must target a city or one of the supported categories.")

    base_url = urlunsplit(("https", "divar.ir", f"/s/{city_slug}", parsed.query, ""))
    return base_url, city_slug


def build_divar_category_url(base_url: str, category: str) -> str:
    if category not in DIVAR_CATEGORY_SLUGS:
        raise ValidationError("Unsupported Divar listing category.")
    normalized, city_slug = normalize_divar_base_url(base_url)
    parsed = urlsplit(normalized)
    return urlunsplit(
        (parsed.scheme, parsed.netloc, f"/s/{city_slug}/{category}", parsed.query, "")
    )


@transaction.atomic
def create_category_targets(*, source, name, base_url, zone, **settings):
    normalized_base_url, city_slug = normalize_divar_base_url(base_url)
    if zone.city.slug != city_slug:
        raise ValidationError(
            {"zone": "The selected zone must belong to the city in the Divar URL."}
        )

    targets = []
    for category, label in ScrapeTarget.ListingCategory.choices:
        search_url = build_divar_category_url(normalized_base_url, category)
        target, _ = ScrapeTarget.objects.update_or_create(
            search_url=search_url,
            defaults={
                "source": source,
                "name": f"{name} - {label}",
                "base_url": normalized_base_url,
                "listing_category": category,
                "zone": zone,
                **settings,
            },
        )
        targets.append(target)
    return targets
