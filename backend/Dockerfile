# syntax=docker/dockerfile:1
FROM python:3.13-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    CHROME_BIN=/usr/bin/chromium \
    PIP_DEFAULT_TIMEOUT=100 \
    PIP_RETRIES=10 \
    DEBIAN_FRONTEND=noninteractive

# ============================================================
# apt config (retry/timeout) - بدون میرور، منابع رسمی Debian
# ============================================================

RUN printf 'Acquire::Retries "10";\nAcquire::http::Timeout "30";\nAcquire::https::Timeout "30";\n' \
      > /etc/apt/apt.conf.d/80-retries

# ============================================================
# apt install با cache mount (build های بعدی سریع‌تر میشن)
# ============================================================

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y --no-install-recommends \
      chromium \
      chromium-driver \
      libpq5 \
      curl \
      ca-certificates

WORKDIR /app

# ============================================================
# نصب requirements جدا از کد (Layer Caching)
# ============================================================

COPY requirements.txt .

RUN --mount=type=cache,target=/root/.cache/pip \
    pip install \
    --default-timeout=100 \
    --retries=10 \
    -r requirements.txt

# ============================================================
# DEVELOPMENT
# ============================================================

FROM base AS dev

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# ============================================================
# PRODUCTION
# ============================================================

FROM base AS production

COPY . .

EXPOSE 8000

CMD ["gunicorn","amlak.wsgi:application","--bind", "0.0.0.0:8000","--workers", "3","--timeout", "60","--access-logfile", "-","--error-logfile", "-"]