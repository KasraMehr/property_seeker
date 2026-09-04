from urllib.parse import urlsplit, urlunsplit

from django.db import migrations


CATEGORIES = {
    "rent-residential",
    "buy-residential",
    "buy-commercial-property",
    "rent-commercial-property",
}


def backfill_targets(apps, schema_editor):
    ScrapeTarget = apps.get_model("ingestion", "ScrapeTarget")
    for target in ScrapeTarget.objects.filter(listing_category="").iterator():
        parsed = urlsplit(target.search_url)
        parts = [part for part in parsed.path.split("/") if part]
        if len(parts) < 3 or parts[0] != "s" or parts[2] not in CATEGORIES:
            continue
        target.listing_category = parts[2]
        target.base_url = urlunsplit(
            (parsed.scheme, parsed.netloc, f"/s/{parts[1]}", parsed.query, "")
        )
        target.save(update_fields=["listing_category", "base_url"])


class Migration(migrations.Migration):
    dependencies = [
        ("ingestion", "0002_scrapetarget_base_url_scrapetarget_listing_category_and_more")
    ]

    operations = [migrations.RunPython(backfill_targets, migrations.RunPython.noop)]
