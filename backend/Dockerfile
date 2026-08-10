FROM python:3.13-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    CHROME_BIN=/usr/bin/chromium

RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium chromium-driver libpq5 curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# ==============================================================
# DEVELOPMENT — used by docker-compose for local work
# ==============================================================
# No COPY . . here on purpose: docker-compose.dev.yml bind-mounts
# your working tree over /app, so edits on the host show up inside
# the container immediately without a rebuild. Code only gets
# baked into the image in the "production" stage below.
#
# No collectstatic here either — with DEBUG=True (the dev default),
# Django's staticfiles app serves static files directly from disk,
# so WhiteNoise's manifest isn't needed for runserver to work.
FROM base AS dev

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


# ==============================================================
# PRODUCTION — used by the Dockerfile-based deploy / docker-compose.yml
# ==============================================================
FROM base AS production

COPY . .

# collectstatic needs settings.py to import cleanly, which needs a
# SECRET_KEY — but DEBUG isn't set at build time, so settings.py
# falls back to its dev-only key and IS_PRODUCTION stays False, so
# none of the fail-fast checks fire here. This bakes WhiteNoise's
# hashed/compressed static manifest into the image so `web` doesn't
# need to run it (and doesn't need write access to the image) at
# container start.

# Run as a non-root user. Chromium/selenium-driven scraping and a
# public-facing gunicorn process are exactly the kind of thing you
# don't want running as root if either is ever compromised.
#RUN groupadd -r app && useradd -r -g app -d /app app \
 #   && chown -R app:app /app
#USER app

EXPOSE 8000

CMD ["gunicorn", "amlak.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", \
     "--timeout", "60", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]