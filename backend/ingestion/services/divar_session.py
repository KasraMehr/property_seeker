from django.conf import settings
from django.utils import timezone
from redis import Redis


SESSION_KEY = "divar:session:state"
CHECK_LOCK_KEY = "divar:session:check-lock"
CHECK_LOCK_SECONDS = 5 * 60


class DivarSessionRequired(RuntimeError):
    pass


def redis_client():
    return Redis.from_url(settings.REDIS_URL, decode_responses=True)


def _public(payload):
    status = payload.get("status", "unknown")
    return {
        "status": status,
        "authenticated": status == "authenticated",
        "detail": payload.get(
            "detail",
            "Divar session has not been checked yet.",
        ),
        "phone_masked": payload.get("phone_masked", ""),
        "checked_at": payload.get("checked_at", ""),
    }


def get_session_state(*, client=None):
    client = client or redis_client()
    payload = client.hgetall(SESSION_KEY)
    return _public(payload)


def set_session_state(status, detail, *, phone_masked="", client=None):
    client = client or redis_client()
    payload = {
        "status": status,
        "detail": detail,
        "phone_masked": phone_masked,
        "checked_at": timezone.now().isoformat(),
    }
    client.hset(SESSION_KEY, mapping=payload)
    return _public(payload)


def require_authenticated_session(*, client=None):
    if not getattr(settings, "DIVAR_REQUIRE_AUTHENTICATED_SESSION", False):
        return {
            "status": "disabled",
            "authenticated": True,
            "detail": "Divar session enforcement is disabled.",
            "phone_masked": "",
            "checked_at": "",
        }
    try:
        state = get_session_state(client=client)
    except Exception as error:
        raise DivarSessionRequired(
            "Divar session status is unavailable; ingestion is blocked."
        ) from error
    if not state["authenticated"]:
        raise DivarSessionRequired(
            "Log in to Divar from the scraper dashboard before running ingestion."
        )
    return state


def begin_session_check(*, client=None):
    client = client or redis_client()
    acquired = client.set(
        CHECK_LOCK_KEY,
        "1",
        nx=True,
        ex=CHECK_LOCK_SECONDS,
    )
    if acquired:
        set_session_state(
            "checking",
            "Checking the persistent Divar browser session.",
            client=client,
        )
    return bool(acquired)


def finish_session_check(*, client=None):
    client = client or redis_client()
    client.delete(CHECK_LOCK_KEY)
