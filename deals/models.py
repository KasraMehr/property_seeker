from django.db import models

# Create your models here.


class Deal(models.Model):

    class DealType(models.TextChoices):
        SALE = "sale", "فروش"
        RENT = "rent", "اجاره"
        MORTGAGE = "mortgage", "رهن"
        RENT_MORTGAGE = "rent_mortgage", "رهن و اجاره"
        EXCHANGE = "exchange","معاوضه"

    class Status(models.TextChoices):
        PENDING = "pending", "در حال مذاکره"
        AGREEMENT = "agreement", "توافق اولیه"
        CONTRACTED = "contracted", "قرارداد بسته شده"
        PAID = "paid", "تسویه شده"
        CANCELED = "canceled", "لغو شده"

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.PROTECT,
        related_name="deals"
    )

    listing = models.ForeignKey(
        "listing.Listing",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="deals"
    )

    agent = models.ForeignKey(
        "accounts.User",
        on_delete=models.PROTECT,
        related_name="deals"
    )

    customer = models.ForeignKey(
        "crm.Customer",
        on_delete=models.PROTECT,
        related_name="deals"
    )

    deal_type = models.CharField(
        max_length=20,
        choices=DealType.choices
    )

    price = models.BigIntegerField()

    deposit_amount = models.BigIntegerField(
        null=True,
        blank=True
    )

    rent_amount = models.BigIntegerField(
        null=True,
        blank=True
    )

    commission_amount = models.BigIntegerField(
        default=0
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    deal_date = models.DateTimeField()

    closed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    notes = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "deals"
        ordering = ["-created_at"]




class Contract(models.Model):

    class Status(models.TextChoices):
        DRAFT = "draft", "پیش نویس"
        ACTIVE = "active", "فعال"
        SIGNED = "signed", "امضا شده"
        EXPIRED = "expired", "منقضی"
        CANCELED = "canceled", "لغو شده"

    class ContractType(models.TextChoices):
        SALE = "sale", "مبایعه نامه"
        RENT = "rent", "اجاره نامه"
        MORTGAGE = "mortgage", "رهن"
        AGREEMENT = "agreement", "توافق نامه"

    deal = models.ForeignKey(
        "deals.Deal",
        on_delete=models.CASCADE,
        related_name="contracts"
    )

    contract_number = models.CharField(
        max_length=50,
        unique=True
    )

    contract_type = models.CharField(
        max_length=20,
        choices=ContractType.choices
    )

    """start_date = models.DateField(
        null=True,
        blank=True
    )

    end_date = models.DateField(
        null=True,
        blank=True
    )"""

    file = models.FileField(
        null=True,
        blank=True
    )

    """status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )

    signed_by_customer = models.BooleanField(default=False)
    signed_by_owner = models.BooleanField(default=False)"""

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "contracts"
        ordering = ["-created_at"]




