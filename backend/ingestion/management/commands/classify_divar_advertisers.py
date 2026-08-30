from django.core.management.base import BaseCommand, CommandError

from ingestion.services.advertiser_classification import (
    classify_listing_synchronously,
    description_hash,
)
from ingestion.tasks import classify_listing_advertiser
from listing.models import Listing


class Command(BaseCommand):
    help = "Queue or synchronously classify Divar listing advertisers."

    def add_arguments(self, parser):
        parser.add_argument("--limit", type=int)
        parser.add_argument(
            "--force",
            action="store_true",
            help="Reclassify listings whose current result is already up to date.",
        )
        parser.add_argument(
            "--sync",
            action="store_true",
            help="Run without Celery/Redis.",
        )

    def handle(self, *args, **options):
        limit = options.get("limit")
        if limit is not None and limit < 1:
            raise CommandError("--limit must be positive.")

        force = options["force"]
        synchronous = options["sync"]
        selected = 0
        skipped = 0
        queryset = (
            Listing.objects.filter(
                source__name__iexact="divar",
            )
            .exclude(description="")
            .select_related("source")
            .order_by("pk")
        )

        for listing in queryset.iterator():
            up_to_date = (
                listing.advertiser_classification_status
                == Listing.AdvertiserClassificationStatus.SUCCEEDED
                and listing.advertiser_type in Listing.AdvertiserType.values
                and listing.advertiser_description_hash
                == description_hash(listing.description)
            )
            if up_to_date and not force:
                skipped += 1
                continue
            if limit is not None and selected >= limit:
                break

            if synchronous:
                classify_listing_synchronously(listing.pk, force=force)
            else:
                classify_listing_advertiser.delay(listing.pk, force=force)
            selected += 1

        mode = "processed" if synchronous else "queued"
        self.stdout.write(
            self.style.SUCCESS(
                f"Advertiser classifications {mode}: {selected}; skipped: {skipped}."
            )
        )
