from django.core.management.base import BaseCommand
from django.db import transaction

from crm.models import CallLog
from properties.models import Owner


class Command(BaseCommand):
    help = "Fix CallLogs where an Owner was incorrectly saved as Customer"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be changed without modifying the database.",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]

        calls = (
            CallLog.objects
            .filter(
                customer__isnull=False,
                owner__isnull=True,
            )
            .select_related("customer", "agency")
        )

        fixed = 0
        not_found = 0

        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    "\nDRY RUN: No database changes will be made.\n"
                )
            )

        with transaction.atomic():

            for call in calls:
                customer = call.customer

                owner = Owner.objects.filter(
                    agency=call.agency,
                    phone=customer.phone,
                ).first()

                if not owner:
                    not_found += 1

                    self.stdout.write(
                        self.style.WARNING(
                            f"[NOT FOUND] "
                            f"CallLog={call.id} | "
                            f"Customer={customer.id} | "
                            f"Name={customer.full_name} | "
                            f"Phone={customer.phone}"
                        )
                    )
                    continue

                self.stdout.write(
                    f"[MATCH] "
                    f"CallLog={call.id} | "
                    f"Customer={customer.id} ({customer.full_name}) "
                    f"-> Owner={owner.id} ({owner.full_name})"
                )

                if not dry_run:
                    call.owner = owner
                    call.customer = None

                    call.save(
                        update_fields=[
                            "owner",
                            "customer",
                        ]
                    )

                fixed += 1

            if dry_run:
                transaction.set_rollback(True)

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"Matched: {fixed}"
            )
        )

        self.stdout.write(
            self.style.WARNING(
                f"Owner not found: {not_found}"
            )
        )

        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    "\nDRY RUN completed. Database was NOT changed."
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    "\nDatabase update completed successfully."
                )
            )