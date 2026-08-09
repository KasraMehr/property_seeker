from django.core.management.base import BaseCommand, CommandError

from ingestion.models import IngestionRun
from ingestion.services.runs import RunAlreadyActive, resume_run
from ingestion.tasks import discover_run, process_run_batch, process_run_synchronously


class Command(BaseCommand):
    help = "Resume a failed, partial, or interrupted ingestion run idempotently."

    def add_arguments(self, parser):
        parser.add_argument("run_id")
        parser.add_argument("--sync", action="store_true")

    def handle(self, *args, **options):
        try:
            run = IngestionRun.objects.get(pk=options["run_id"])
            run = resume_run(run=run)
        except (IngestionRun.DoesNotExist, ValueError) as error:
            raise CommandError("Ingestion run does not exist.") from error
        except RunAlreadyActive as error:
            raise CommandError(str(error)) from error

        has_items = run.items.exists()
        if options["sync"]:
            if not has_items:
                discover_run.run(str(run.pk), enqueue_details=False)
            process_run_synchronously(run.pk)
        elif has_items:
            process_run_batch.delay(str(run.pk))
        else:
            discover_run.delay(str(run.pk))
        self.stdout.write(self.style.SUCCESS(f"Resumed ingestion run: {run.pk}"))
