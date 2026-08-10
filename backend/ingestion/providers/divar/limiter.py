import random
import threading
import time


class LocalRequestLimiter:
    def __init__(self, interval_seconds=2.5):
        self.interval_seconds = interval_seconds
        self._lock = threading.Lock()
        self._next_request_at = 0.0
        self._blocked_until = 0.0

    def wait(self):
        with self._lock:
            now = time.monotonic()
            scheduled = max(now, self._next_request_at, self._blocked_until)
            self._next_request_at = (
                scheduled + self.interval_seconds + random.uniform(0, 0.5)
            )
        delay = scheduled - time.monotonic()
        if delay > 0:
            time.sleep(delay)

    def block(self, seconds):
        with self._lock:
            self._blocked_until = max(self._blocked_until, time.monotonic() + seconds)


class RedisRequestLimiter:
    def __init__(self, redis_client, key="divar", interval_seconds=2.5):
        self.client = redis_client
        self.key = key
        self.interval_seconds = interval_seconds

    @property
    def timestamp_key(self):
        return f"ingestion:rate:{self.key}:last"

    @property
    def blocked_key(self):
        return f"ingestion:rate:{self.key}:blocked"

    def wait(self):
        lock = self.client.lock(
            f"ingestion:rate:{self.key}:lock",
            timeout=120,
            blocking_timeout=120,
        )
        with lock:
            now = time.time()
            last = float(self.client.get(self.timestamp_key) or 0)
            blocked_until = float(self.client.get(self.blocked_key) or 0)
            scheduled = max(now, last + self.interval_seconds, blocked_until)
            delay = scheduled - now
            if delay > 0:
                time.sleep(delay)
            self.client.set(self.timestamp_key, time.time(), ex=300)

    def block(self, seconds):
        until = time.time() + seconds
        self.client.set(self.blocked_key, until, ex=max(1, int(seconds) + 5))
