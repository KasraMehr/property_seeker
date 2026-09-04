from django.db import migrations


def backfill_listing_categories(apps, schema_editor):
    Listing = apps.get_model("listing", "Listing")
    TargetListing = apps.get_model("ingestion", "TargetListing")

    memberships = (
        TargetListing.objects.exclude(target__listing_category="")
        .select_related("target")
        .order_by("listing_id", "id")
    )
    seen = set()
    for membership in memberships.iterator():
        if membership.listing_id in seen:
            continue
        Listing.objects.filter(pk=membership.listing_id, category="").update(
            category=membership.target.listing_category
        )
        seen.add(membership.listing_id)


class Migration(migrations.Migration):
    dependencies = [
        ("ingestion", "0003_backfill_target_categories"),
        ("listing", "0005_listing_category_listing_divar_neighborhood"),
    ]

    operations = [
        migrations.RunPython(backfill_listing_categories, migrations.RunPython.noop)
    ]
