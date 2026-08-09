import csv
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from ingestion.models import IngestionRun

EXPORT_FIELDS = (
    "external_id",
    "url",
    "title",
    "listed_area",
    "build_year",
    "room_count",
    "listed_sale_price",
    "listed_price_per_meter",
    "listed_mortgage_amount",
    "listed_deposit_amount",
    "listed_rent_amount",
    "floor_number",
    "total_floors",
    "pictures_match_property",
    "media_count",
    "description",
    "published_at",
    "source_updated_at",
    "first_seen_at",
    "last_seen_at",
    "last_checked_at",
    "status",
    "review_status",
)


class Command(BaseCommand):
    help = "Export the normalized listings touched by an ingestion run to CSV."

    def add_arguments(self, parser):
        parser.add_argument("run_id")
        parser.add_argument("--output")

    def handle(self, *args, **options):
        try:
            run = IngestionRun.objects.get(pk=options["run_id"])
        except (IngestionRun.DoesNotExist, ValueError) as error:
            raise CommandError("Ingestion run does not exist.") from error
        output = options.get("output") or (
            f"Data_log/divar_ingestion_{run.pk}_{timezone.localtime():%Y%m%d_%H%M%S}.csv"
        )
        destination = Path(output).resolve()
        destination.parent.mkdir(parents=True, exist_ok=True)
        listings = (
            run.items.filter(listing__isnull=False)
            .select_related("listing")
            .order_by("discovery_order")
        )
        with destination.open("w", encoding="utf-8-sig", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=EXPORT_FIELDS)
            writer.writeheader()
            for item in listings:
                writer.writerow(
                    {field: getattr(item.listing, field) for field in EXPORT_FIELDS}
                )
        run.artifact_path = str(destination)
        run.save(update_fields=["artifact_path"])
        self.stdout.write(self.style.SUCCESS(str(destination)))
