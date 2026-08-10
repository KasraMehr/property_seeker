from django.db import models

# Create your models here.


class PriceLog(models.Model):

    property = models.ForeignKey(
        "properties.Property", on_delete=models.CASCADE, related_name="price_logs"
    )
    # قیمت هر متر مربع (برای فروش)
    price_per_meter = models.BigIntegerField(null=True, blank=True)

    # قیمت کل ملک (برای فروش)
    sale_price = models.BigIntegerField(null=True, blank=True)

    # مبلغ رهن کامل
    mortgage_amount = models.BigIntegerField(null=True, blank=True)

    # ودیعه اجاره
    deposit_amount = models.BigIntegerField(null=True, blank=True)

    # اجاره ماهیانه
    monthly_rent = models.BigIntegerField(null=True, blank=True)

    changed_by = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "price_logs"
        ordering = ["-created_at"]


# برای کارمندان ورود خروجشون ثت ش
import uuid

from django.db import models


class ActivityLog(models.Model):

    class Action(models.TextChoices):
        CREATE = "create", "ایجاد"
        UPDATE = "update", "ویرایش"
        DELETE = "delete", "حذف"
        VIEW = "view", "مشاهده"

        LOGIN = "login", "ورود"
        LOGOUT = "logout", "خروج"

        STATUS_CHANGE = "status_change", "تغییر وضعیت"

        API_CALL = "api_call", "درخواست API"

    class Source(models.TextChoices):
        API = "api", "API"
        ADMIN = "admin", "پنل ادمین"
        SYSTEM = "system", "سیستم"
        CRON = "cron", "Cron Job"

    class Level(models.TextChoices):
        INFO = "info", "Info"
        WARNING = "warning", "Warning"
        ERROR = "error", "Error"
        CRITICAL = "critical", "Critical"

    class Outcome(models.TextChoices):
        SUCCESS = "success", "موفق"
        FAILED = "failed", "ناموفق"

    request_id = models.UUIDField(
        default=uuid.uuid4,
        db_index=True,
        editable=False,
    )

    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="activity_logs",
    )

    action = models.CharField(
        max_length=30,
        choices=Action.choices,
    )

    source = models.CharField(
        max_length=20,
        choices=Source.choices,
        default=Source.API,
    )

    level = models.CharField(
        max_length=10,
        choices=Level.choices,
        default=Level.INFO,
    )

    outcome = models.CharField(
        max_length=10,
        choices=Outcome.choices,
        default=Outcome.SUCCESS,
    )

    # ---------- Entity ----------

    entity_type = models.CharField(
        max_length=50,
        db_index=True,
    )  # روی کدوم ابجکت عملیات انجام شده

    entity_id = models.CharField(
        max_length=50,
        db_index=True,
    )

    # ---------- Changes ----------

    old_data = models.JSONField(
        default=dict,
        blank=True,
    )

    new_data = models.JSONField(
        default=dict,
        blank=True,
    )

    # ---------- Request ----------

    request_method = models.CharField(
        max_length=10,
        blank=True,
    )

    request_path = models.CharField(
        max_length=255,
        blank=True,
    )  # ادرس url

    query_params = models.JSONField(
        default=dict,
        blank=True,
    )

    status_code = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
    )

    duration_ms = models.PositiveIntegerField(
        null=True,
        blank=True,
    )  # مدت زمان اجرای درخواست

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
    )

    user_agent = models.TextField(
        blank=True,
    )

    # ---------- Message ----------

    message = models.TextField(
        blank=True,
    )

    error_trace = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        db_table = "activity_logs"

        ordering = [
            "-created_at",
        ]

        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["action"]),
            models.Index(fields=["entity_type"]),
            models.Index(fields=["entity_type", "entity_id"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["request_id"]),
            models.Index(fields=["source"]),
            models.Index(fields=["level"]),
            models.Index(fields=["outcome"]),
        ]

    def __str__(self):
        return f"{self.action} | " f"{self.entity_type}:{self.entity_id}"


"""
چه چیزهایی در  املاک  ثبت می‌شوند؟

تقریباً تمام عملیات مهم:

✅ ورود کاربر
✅ خروج کاربر
✅ ایجاد مالک
✅ ویرایش مالک
✅ حذف مالک
✅ ایجاد ملک
✅ تغییر وضعیت ملک
✅ تغییر قیمت ملک
✅ حذف ملک
✅ ایجاد معامله
✅ تغییر معامله
✅ ایجاد قرارداد
✅ آپلود عکس
✅ حذف عکس
✅ خطاهای مهم API
"""
