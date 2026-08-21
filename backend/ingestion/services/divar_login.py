import time
import uuid

from django.conf import settings
from django.utils import timezone
from redis import Redis


ATTEMPT_PREFIX = "divar:login:attempt:"
OTP_PREFIX = "divar:login:otp:"
ACTIVE_KEY = "divar:login:active"
ATTEMPT_TTL_SECONDS = 2 * 60 * 60
OTP_TTL_SECONDS = 10 * 60
TERMINAL_STATUSES = {"succeeded", "failed", "expired"}


class DivarLoginAttemptError(RuntimeError):
    pass


class DivarLoginAttemptNotFound(DivarLoginAttemptError):
    pass


class DivarLoginAttemptActive(DivarLoginAttemptError):
    def __init__(self, attempt_id):
        self.attempt_id = attempt_id
        super().__init__("A Divar login attempt is already active.")


def redis_client():
    return Redis.from_url(settings.REDIS_URL, decode_responses=True)


def _attempt_key(attempt_id):
    return f"{ATTEMPT_PREFIX}{attempt_id}"


def _otp_key(attempt_id):
    return f"{OTP_PREFIX}{attempt_id}"


def _mask_phone(phone):
    return f"{phone[:4]}***{phone[-4:]}"


def _public(payload):
    return {
        key: payload.get(key, "")
        for key in (
            "id",
            "status",
            "detail",
            "phone_masked",
            "created_at",
            "updated_at",
        )
    }


def get_attempt(attempt_id, *, client=None):
    client = client or redis_client()
    payload = client.hgetall(_attempt_key(attempt_id))
    if not payload:
        raise DivarLoginAttemptNotFound("Divar login attempt was not found or expired.")
    return _public(payload)


def create_attempt(phone, *, client=None):
    client = client or redis_client()
    attempt_id = str(uuid.uuid4())
    acquired = client.set(
        ACTIVE_KEY,
        attempt_id,
        nx=True,
        ex=ATTEMPT_TTL_SECONDS,
    )
    if not acquired:
        active_id = client.get(ACTIVE_KEY)
        if active_id:
            try:
                active = get_attempt(active_id, client=client)
            except DivarLoginAttemptNotFound:
                client.delete(ACTIVE_KEY)
                return create_attempt(phone, client=client)
            if active["status"] not in TERMINAL_STATUSES:
                raise DivarLoginAttemptActive(active_id)
        client.delete(ACTIVE_KEY)
        return create_attempt(phone, client=client)

    now = timezone.now().isoformat()
    payload = {
        "id": attempt_id,
        "status": "queued",
        "detail": "Login request queued on the scraper worker.",
        "phone_masked": _mask_phone(phone),
        "created_at": now,
        "updated_at": now,
    }
    pipe = client.pipeline()
    pipe.hset(_attempt_key(attempt_id), mapping=payload)
    pipe.expire(_attempt_key(attempt_id), ATTEMPT_TTL_SECONDS)
    pipe.execute()
    return _public(payload)


def update_attempt(attempt_id, *, status, detail, client=None):
    client = client or redis_client()
    key = _attempt_key(attempt_id)
    if not client.exists(key):
        raise DivarLoginAttemptNotFound("Divar login attempt was not found or expired.")
    client.hset(
        key,
        mapping={
            "status": status,
            "detail": detail,
            "updated_at": timezone.now().isoformat(),
        },
    )
    client.expire(key, ATTEMPT_TTL_SECONDS)
    return get_attempt(attempt_id, client=client)


def submit_otp(attempt_id, otp, *, client=None):
    client = client or redis_client()
    attempt = get_attempt(attempt_id, client=client)
    if attempt["status"] != "waiting_otp":
        raise DivarLoginAttemptError(
            "This login attempt is not currently waiting for an OTP."
        )
    pipe = client.pipeline()
    pipe.set(_otp_key(attempt_id), otp, ex=OTP_TTL_SECONDS)
    pipe.hset(
        _attempt_key(attempt_id),
        mapping={
            "status": "verifying",
            "detail": "OTP received; Divar is verifying the session.",
            "updated_at": timezone.now().isoformat(),
        },
    )
    pipe.execute()
    return get_attempt(attempt_id, client=client)


def wait_for_otp(attempt_id, timeout_seconds, *, client=None):
    client = client or redis_client()
    deadline = time.monotonic() + timeout_seconds
    while time.monotonic() < deadline:
        otp = client.getdel(_otp_key(attempt_id))
        if otp:
            return otp
        time.sleep(0.5)
    raise DivarLoginAttemptError("Timed out waiting for the Divar OTP.")


def finish_attempt(attempt_id, *, status, detail, client=None):
    client = client or redis_client()
    attempt = update_attempt(
        attempt_id,
        status=status,
        detail=detail,
        client=client,
    )
    client.delete(_otp_key(attempt_id))
    client.eval(
        "if redis.call('get', KEYS[1]) == ARGV[1] then "
        "return redis.call('del', KEYS[1]) else return 0 end",
        1,
        ACTIVE_KEY,
        str(attempt_id),
    )
    return attempt

