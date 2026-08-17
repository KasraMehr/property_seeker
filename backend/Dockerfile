FROM python:3.13-slim AS production

# ۱. تنظیم میرور Pip رانفلیر
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_INDEX_URL=https://mirror-pypi.runflare.com/simple \
    PIP_TRUSTED_HOST=mirror-pypi.runflare.com \
    CHROME_BIN=/usr/bin/chromium

# ساخت کاربر غیر root
#RUN groupadd -g 1000 appgroup && \
 #   useradd -u 1000 -g appgroup -s /bin/bash -m appuser

# ۲. تغییر مخازن Apt به رانفلیر و نصب پکیج‌ها
RUN sed -i 's/deb.debian.org/mirror.runflare.com/g' /etc/apt/sources.list.d/debian.sources 2>/dev/null || \
    sed -i 's/deb.debian.org/mirror.runflare.com/g' /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        chromium \
        chromium-driver \
        libpq5 \
        curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

# نصب وابستگی‌های پایتون از رانفلیر
RUN pip install -r requirements.txt

COPY . .

#RUN chown -R appuser:appgroup /app

#USER appuser

EXPOSE 8000

CMD ["gunicorn", "amlak.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "60", "--access-logfile", "-", "--error-logfile", "-"]