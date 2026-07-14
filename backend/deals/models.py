from datetime import timezone

from django.db import models

from django.db import transaction

# Create your models here.


class Deal(models.Model):#این مدل اطلاعات مربوط به یک معامله را نگهداری می‌کند.

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

    deal_number = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        db_index=True,
    )

    listing = models.ForeignKey(
        "listing.Listing",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="deals"
    )

    agent = models.ForeignKey(    #یعنی اگر این کاربر در معامله‌ای استفاده شده باشد، اجازه حذف او را نده.
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

    price = models.PositiveBigIntegerField()

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

    @classmethod
    def generate_deal_number(cls):
        year = timezone.now().year

        last_deal = (
            cls.objects
            .select_for_update()
            .filter(deal_number__startswith=f"DL-{year}-")
            .order_by("-deal_number")
            .first()
        )

        if last_deal:
            last_number = int(last_deal.deal_number.split("-")[-1])
        else:
            last_number = 0

        next_number = last_number + 1

        return f"DL-{year}-{next_number:06d}"

    def save(self, *args, **kwargs):

        if not self.deal_number:
            with transaction.atomic():
                self.deal_number = Deal.generate_deal_number()

        super().save(*args, **kwargs)


class Contract(models.Model):#این مدل قراردادهای مربوط به معاملات را نگهداری می‌کند.

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
        unique=True,
        editable=False,
        db_index=True
    )

    contract_type = models.CharField(
        max_length=20,
        choices=ContractType.choices
    )

    start_date = models.DateField(
        null=True,
        blank=True
    )

    end_date = models.DateField(
        null=True,
        blank=True
    )

    file = models.FileField(
        upload_to="contracts/",
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )

    signed_by_customer = models.BooleanField(default=False)
    signed_by_owner = models.BooleanField(default=False)

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "contracts"
        ordering = ["-created_at"]

    @classmethod
    def generate_contract_number(cls):
        year = timezone.now().year

        last_contract = (
            cls.objects
            .select_for_update()
            .filter(contract_number__startswith=f"DL-{year}-")
            .order_by("-contract_number")
            .first()
        )

        if last_contract:
            last_number = int(last_contract.contract_number.split("-")[-1])
        else:
            last_number = 0

        next_number = last_number + 1

        return f"DL-{year}-{next_number:06d}"

    def save(self, *args, **kwargs):

        if not self.contract_number:
            with transaction.atomic():
                self.contract_number = Contract.generate_contract_number()

        super().save(*args, **kwargs)

    def __str__(self):
        return self.contract_number




