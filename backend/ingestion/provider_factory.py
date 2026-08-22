from django.conf import settings

from ingestion.providers.divar import DivarProvider
from ingestion.providers.divar.limiter import LocalRequestLimiter, RedisRequestLimiter

_local_limiter = None


def create_divar_provider(**overrides):
    global _local_limiter
    interval = settings.DIVAR_REQUEST_INTERVAL_SECONDS
    try:
        import redis

        client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
        client.ping()
        limiter = RedisRequestLimiter(
            client,
            key="divar",
            interval_seconds=interval,
        )
    except Exception:
        if _local_limiter is None or _local_limiter.interval_seconds != interval:
            _local_limiter = LocalRequestLimiter(interval_seconds=interval)
        limiter = _local_limiter
    options = {
        "limiter": limiter,
        "profile_dir": settings.DIVAR_PROFILE_DIR,
        "phone_ingestion_enabled": settings.DIVAR_PHONE_INGESTION_ENABLED,
    }
    options.update(overrides)
    return DivarProvider(
        **options,
    )
