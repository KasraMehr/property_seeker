import getpass
import os
import time
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from ingestion.providers.divar.login import DivarLoginError, DivarLoginFlow
from ingestion.providers.divar.parser import normalize_iran_mobile
from ingestion.providers.divar.provider import DivarProvider, ProviderError


class Command(BaseCommand):
    help = "Authenticate the persistent Divar browser profile with a one-time OTP."

    def add_arguments(self, parser):
        parser.add_argument(
            "--phone",
            required=True,
            help="Iranian mobile number used for the Divar account.",
        )
        parser.add_argument(
            "--timeout",
            type=int,
            default=90,
            help="Seconds to wait for each login step (default: 90).",
        )

    @staticmethod
    def _read_otp(wait_seconds):
        handoff_path = os.environ.get("DIVAR_OTP_HANDOFF_FILE", "").strip()
        if not handoff_path:
            return getpass.getpass("Divar OTP: ").strip()

        path = Path(handoff_path)
        deadline = time.monotonic() + wait_seconds
        while time.monotonic() < deadline:
            try:
                otp = path.read_text(encoding="utf-8").lstrip("\ufeff").strip()
            except FileNotFoundError:
                otp = ""
            if otp:
                path.unlink(missing_ok=True)
                return otp
            time.sleep(0.5)
        raise CommandError("Timed out waiting for the Divar OTP handoff.")

    def handle(self, *args, **options):
        phone = normalize_iran_mobile(options["phone"])
        if not phone:
            raise CommandError("--phone must be a valid Iranian mobile number.")
        if not settings.DIVAR_PROFILE_DIR:
            raise CommandError(
                "DIVAR_PROFILE_DIR must point to the persistent scraper profile."
            )

        provider = DivarProvider(
            profile_dir=settings.DIVAR_PROFILE_DIR,
            phone_ingestion_enabled=False,
        )
        flow = DivarLoginFlow(provider, step_timeout=options["timeout"])
        self.stdout.write("Opening Divar login in the persistent scraper profile...")

        try:
            result = flow.authenticate(
                phone,
                read_otp=self._read_otp,
                on_otp_requested=lambda: self.stdout.write(
                    "OTP requested; waiting for the verification code..."
                ),
            )
        except (DivarLoginError, ProviderError) as error:
            raise CommandError(str(error)) from error

        message = (
            "Divar profile was already logged in."
            if result == "already_authenticated"
            else "Divar login saved."
        )
        self.stdout.write(self.style.SUCCESS(message))

