from django.core.management.base import BaseCommand

from locations.services import sync_divar_neighborhoods


class Command(BaseCommand):
    help = "Synchronize canonical Divar neighborhoods for a city slug."

    def add_arguments(self, parser):
        parser.add_argument("city_slug", nargs="?", default="fardis")

    def handle(self, *args, **options):
        result = sync_divar_neighborhoods(options["city_slug"])
        self.stdout.write(self.style.SUCCESS(str(result)))
