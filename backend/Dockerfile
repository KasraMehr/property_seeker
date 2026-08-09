FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    CHROME_BIN=/usr/bin/chromium

RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium chromium-driver libpq5 curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# collectstatic needs settings.py to import cleanly, which needs a
# SECRET_KEY — but DEBUG isn't set at build time, so settings.py
# falls back to its dev-only key and IS_PRODUCTION stays False, so
# none of the fail-fast checks fire here. This bakes WhiteNoise's
# hashed/compressed static manifest into the image so `web` doesn't
# need to run it (and doesn't need write access to the image) at
# container start.
#RUN python manage.py collectstatic --noinput

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