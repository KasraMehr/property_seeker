from django.db import models

# Create your models here.

class PriceLog(models.Model):

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="price_logs"
    )
    # قیمت هر متر مربع (برای فروش)
    price_per_meter = models.BigIntegerField(
        null=True,
        blank=True
    )

    # قیمت کل ملک (برای فروش)
    sale_price = models.BigIntegerField(
        null=True,
        blank=True
    )

    # مبلغ رهن کامل
    mortgage_amount = models.BigIntegerField(
        null=True,
        blank=True
    )

    # ودیعه اجاره
    deposit_amount = models.BigIntegerField(
        null=True,
        blank=True
    )

    # اجاره ماهیانه
    monthly_rent = models.BigIntegerField(
        null=True,
        blank=True
    )

    changed_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "price_logs"
        ordering = ["-created_at"]

#برای کارمندان ورود خروجشون ثت ش
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

    class Level(models.TextChoices):
        INFO = "info", "اطلاعات"
        WARNING = "warning", "هشدار"
        ERROR = "error", "خطا"
        CRITICAL = "critical", "بحرانی"

    class Source(models.TextChoices):
        API = "api", "API"
        ADMIN = "admin", "ادمین"
        SYSTEM = "system", "سیستم"
        CRON = "cron", "کرون جاب"

    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="activity_logs"
    )

    request_id = models.UUIDField(
        null=True,
        blank=True,
        db_index=True
    )

    action = models.CharField(
        max_length=30,
        choices=Action.choices
    )

    entity_type = models.CharField(
        max_length=50,
        db_index=True
    )

    entity_id = models.CharField(
        max_length=50,
        db_index=True
    )

    old_data = models.JSONField(
        default=dict,
        blank=True
    )

    new_data = models.JSONField(
        default=dict,
        blank=True
    )

    # --- request info (اصلاح شده و داخل مدل) ---
    request_path = models.CharField(
        max_length=255,
        blank=True
    )

    request_method = models.CharField(
        max_length=10,
        blank=True
    )

    request_full_url = models.TextField(
        blank=True
    )

    query_params = models.JSONField(
        default=dict,
        blank=True
    )

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True
    )

    user_agent = models.TextField(
        blank=True
    )

    source = models.CharField(
        max_length=20,
        choices=Source.choices,
        default=Source.API
    )

    level = models.CharField(
        max_length=10,
        choices=Level.choices,
        default=Level.INFO
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "activity_logs"
        ordering = ["-created_at"]

        indexes = [
            models.Index(fields=["entity_type", "entity_id"]),
            models.Index(fields=["user", "action"]),
            models.Index(fields=["request_id"]),
            models.Index(fields=["created_at"]),
        ]
