from django.core.management.base import BaseCommand, CommandError

from ingestion.models import IngestionRun, ScrapeTarget
from ingestion.services.runs import RunAlreadyActive, create_run
from ingestion.tasks import discover_run, process_run_synchronously


class Command(BaseCommand):
    help = "Queue a Divar full, discovery, or reconciliation ingestion run."

    def add_arguments(self, parser):
        parser.add_argument("--target", type=int, required=True)
        parser.add_argument(
            "--mode",
            choices=[
                IngestionRun.Mode.FULL,
                IngestionRun.Mode.DISCOVERY,
                IngestionRun.Mode.RECONCILIATION,
            ],
            default=IngestionRun.Mode.FULL,
        )
        parser.add_argument(
            "--sync",
            action="store_true",
            help="Run in this process instead of queueing through Celery.",
        )
        parser.add_argument(
            "--detail-limit",
            type=int,
            help="Only fetch this many discovered details (useful for semantic audits).",
        )

    def handle(self, *args, **options):
        try:
            target = ScrapeTarget.objects.get(pk=options["target"])
        except ScrapeTarget.DoesNotExist as error:
            raise CommandError("Scrape target does not exist.") from error
        try:
            configuration = {}
            if options.get("detail_limit"):
                if options["detail_limit"] < 1:
                    raise CommandError("--detail-limit must be positive.")
                configuration["detail_limit"] = options["detail_limit"]
            run = create_run(
                target=target,
                mode=options["mode"],
                configuration=configuration,
            )
        except RunAlreadyActive as error:
            raise CommandError(str(error)) from error
        if options["sync"]:
            discover_run.run(str(run.pk), enqueue_details=False)
            process_run_synchronously(run.pk)
        else:
            discover_run.delay(str(run.pk))
        self.stdout.write(self.style.SUCCESS(f"Ingestion run: {run.pk}"))
