# ==========================================
# 1. Base Stage (مشترک بین Dev و Production)
# ==========================================
FROM python:3.13-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    CHROME_BIN=/usr/bin/chromium

# نصب ابزارهای پایه و Chromium (با میرور داخلی apt)
RUN sed -i \
      -e 's|deb.debian.org/debian-security|mirror.arvancloud.ir/debian-security|g' \
      -e 's|deb.debian.org/debian|mirror.arvancloud.ir/debian|g' \
      /etc/apt/sources.list.d/debian.sources \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        chromium \
        chromium-driver \
        libpq-dev \
        curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -i https://mirror-pypi.runflare.com/simple --trusted-host mirror-pypi.runflare.com -r requirements.txt

# ==========================================
# 2. Development Stage (مخصوص توسعه)
# ==========================================
FROM base AS development

# اجرا با runserver برای Reload خودکار
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# ==========================================
# 3. Production Stage (مخصوص سرور اصلی)
# ==========================================
FROM base AS production

COPY . .

EXPOSE 8000

CMD ["gunicorn", "amlak.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "60", "--access-logfile", "-", "--error-logfile", "-"]
