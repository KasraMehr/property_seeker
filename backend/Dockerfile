FROM python:3.13-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    CHROME_BIN=/usr/bin/chromium \
    PIP_DEFAULT_TIMEOUT=100 \
    PIP_RETRIES=10

# ============================================================
# Debian Repository Mirror
# ============================================================

RUN set -eux; \
    rm -f /etc/apt/sources.list.d/debian.sources; \
    printf '%s\n' \
      'deb https://repo.abrha.net/debian trixie main contrib non-free non-free-firmware' \
      'deb https://repo.abrha.net/debian trixie-updates main contrib non-free non-free-firmware' \
      'deb https://repo.abrha.net/debian-security trixie-security main contrib non-free non-free-firmware' \
      > /etc/apt/sources.list; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
      chromium \
      chromium-driver \
      libpq5 \
      curl \
      ca-certificates; \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

# ============================================================
# Python Packages - PyPI Mirror
# ============================================================

RUN pip install \
    --no-cache-dir \
    --index-url https://mirror.kargadan.ir/repository/pypi-group/simple/ \
    --trusted-host mirror.kargadan.ir \
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