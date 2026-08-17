FROM python:3.13-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    CHROME_BIN=/usr/bin/chromium

# 1. تنظیم دقیق سورس‌های دبیان با HTTPS و مخزن معتبر
RUN printf '%s\n' \
  "deb http://repo.liara.ir/debian trixie main contrib non-free non-free-firmware" \
  "deb http://repo.liara.ir/debian trixie-updates main contrib non-free non-free-firmware" \
  "deb http://repo.liara.ir/debian-security trixie-security main contrib non-free non-free-firmware" \
  > /etc/apt/sources.list \
  && apt-get update \
  && apt-get install -y --no-install-recommends chromium chromium-driver libpq5 curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .

# 2. نصب پکیج‌ها با استفاده از میرور و تنظیمات ضدِ قطع و وصلی شبکه
# اضافه کردن --default-timeout و تنظیم index-url برای رفع مشکل SSL و کندی
RUN pip install --no-cache-dir \
    --index-url https://mirror.kargadan.ir/repository/pypi-group/simple/ \
    --trusted-host mirror.kargadan.ir \
    --default-timeout=100 \
    --retries 10 \
    -r requirements.txt

# بقیه فایل تغییری نمی‌کند
# ==============================================================
# DEVELOPMENT
# ==============================================================
FROM base AS dev
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# ==============================================================
# PRODUCTION
# ==============================================================
FROM base AS production
COPY . .
EXPOSE 8000
CMD ["gunicorn", "amlak.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", \
     "--timeout", "60", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
