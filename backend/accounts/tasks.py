"""from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from celery import shared_task

import os
import requests
from django.conf import settings
from celery import shared_task

@shared_task
def clear_expired_blacklisted_tokens():
    now = timezone.now()

    # فقط توکن‌هایی که:
    # ۱. منقضی شدند
    # ۲. در بلک‌لیست هستند (لاگ‌اوت شدند)
    expired_blacklisted = OutstandingToken.objects.filter(
        expires_at__lt=now,
        blacklistedtoken__isnull=False  # بلک‌لیست شده باشد
    )

    count = expired_blacklisted.count()
    expired_blacklisted.delete()  # BlacklistedToken هم cascade پاک می‌شود

    return f"{count} توکن منقضی و بلک‌لیست شده پاک شد"""

"""OutstandingToken	ثبت تمام Refresh Tokenهای صادرشده برای پیگیری و مدیریت
BlacklistedToken	ثبت Refresh Tokenهایی که دیگر نباید پذیرفته شوند
ROTATE_REFRESH_TOKENS	هنگام Refresh، یک Refresh Token جدید صادر می‌کند.
BLACKLIST_AFTER_ROTATION	Refresh Token قبلی را پس از صدور توکن جدید باطل (Blacklisted) می‌کند."""
