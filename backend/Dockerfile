# ============================================================
# PRODUCTION DOCKERFILE
# ============================================================

FROM python:3.13-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_INDEX_URL=https://package-mirror.liara.ir/repository/pypi/simple \
    CHROME_BIN=/usr/bin/chromium

# System dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        chromium \
        chromium-driver \
        libpq5 \
        curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first
# This keeps pip install cached when application code changes.
COPY requirements.txt .

# Install Python dependencies from Liara PyPI mirror
RUN pip install -r requirements.txt

# Copy application
COPY . .

# ============================================================
# STATIC FILES
# ============================================================

#RUN python manage.py collectstatic --noinput

# ============================================================
# PRODUCTION
# ============================================================

EXPOSE 8000

CMD [
    "gunicorn",
    "amlak.wsgi:application",
    "--bind",
    "0.0.0.0:8000",
    "--workers",
    "3",
    "--timeout",
    "60",
    "--access-logfile",
    "-",
    "--error-logfile",
    "-"
]