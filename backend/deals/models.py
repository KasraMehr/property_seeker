from django.db import models, transaction
from django.utils import timezone


class Deal(models.Model):

    class DealType(models.TextChoices):
        SALE = "sale", "فروش"
        RENT = "rent", "اجاره"
        MORTGAGE = "mortgage", "رهن"
        RENT_MORTGAGE = "rent_mortgage", "رهن و اجاره"
        EXCHANGE = "exchange", "معاوضه"

    class Status(models.TextChoices):
        PENDING = "pending", "در حال مذاکره"
        AGREEMENT = "agreement", "توافق اولیه"
        CONTRACTED = "contracted", "قرارداد بسته شده"
        PAID = "paid", "تسویه شده"
        CANCELED = "canceled", "لغو شده"

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.PROTECT,
        related_name="deals",
    )

    agency = models.ForeignKey(
        "accounts.Agency",
        on_delete=models.CASCADE,
        related_name="deals",
    )

    listing = models.ForeignKey(
        "listing.Listing",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="deals",
    )

    customer = models.ForeignKey(
        "crm.Customer",
        on_delete=models.PROTECT,
        related_name="deals",
    )

    agent = models.ForeignKey(
        "accounts.User",
        on_delete=models.PROTECT,
        related_name="deals",
    )

    deal_number = models.CharField(
        max_length=30,
        unique=True,
        editable=False,
        db_index=True,
    )

    deal_type = models.CharField(
        max_length=30,
        choices=DealType.choices,
    )

    price = models.PositiveBigIntegerField()

    deposit_amount = models.BigIntegerField(
        null=True,
        blank=True,
    )

    rent_amount = models.BigIntegerField(
        null=True,
        blank=True,
    )

    commission_amount = models.PositiveBigIntegerField(
        default=0,
    )

    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.PENDING,
    )

    deal_date = models.DateTimeField()

    closed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    notes = models.TextField(blank=True)

    is_deleted = models.BooleanField(
        default=False
    )

    created_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.PROTECT,
        related_name="created_deals",
    )

    updated_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.PROTECT,
        related_name="updated_deals",
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    constraints = [
        models.UniqueConstraint(
            fields=[
                "agency",
                "deal_number"
            ],
            name="unique_deal_number_per_agency"
        )
    ]

    @classmethod
    def generate_deal_number(cls, agency):

        year = timezone.now().year

        last_deal = (
            cls.objects
            .select_for_update()
            .filter(
                agency=agency,
                deal_number__startswith=f"DL-{agency.id}-{year}-"
            )
            .order_by("-deal_number")
            .first()
        )

        if last_deal:
            last_number = int(
                last_deal.deal_number.split("-")[-1]
            )
        else:
            last_number = 0

        next_number = last_number + 1

        return (
            f"DL-{agency.id}-{year}-{next_number:06d}")


    def save(self, *args, **kwargs):

        if not self.deal_number:
            with transaction.atomic():
                self.deal_number = (
                    self.generate_deal_number(
                        self.agency
                    )
                )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.deal_number

from django.db import models, transaction
from django.utils import timezone


class Contract(models.Model):#مدل Contract برای نگهداری قراردادهای مربوط به معاملات استفاده می‌شود

    class Status(models.TextChoices):
        DRAFT = "draft", "پیش‌نویس"
        ACTIVE = "active", "فعال"
        SIGNED = "signed", "امضا شده"
        EXPIRED = "expired", "منقضی"
        CANCELED = "canceled", "لغو شده"

    class ContractType(models.TextChoices):
        SALE = "sale", "مبایعه‌نامه"
        RENT = "rent", "اجاره‌نامه"
        MORTGAGE = "mortgage", "رهن"
        AGREEMENT = "agreement", "توافق‌نامه"

    deal = models.ForeignKey(
        "deals.Deal",
        on_delete=models.CASCADE,
        related_name="contracts",
    )

    agency = models.ForeignKey(
        "accounts.Agency",
        on_delete=models.CASCADE,
        related_name="contracts",
    )

    contract_number = models.CharField(
        max_length=30,
        editable=False,
        db_index=True,
    )

    contract_type = models.CharField(
        max_length=30,
        choices=ContractType.choices,
    )

    file = models.FileField(
        upload_to="contracts/",
        null=True,
        blank=True,
    )

    start_date = models.DateField(
        null=True,
        blank=True,
    )

    end_date = models.DateField(
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )

    signed_by_customer = models.BooleanField(
        default=False,
    )

    signed_by_owner = models.BooleanField(
        default=False,
    )

    created_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.PROTECT,
        related_name="created_contracts",
    )

    notes = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:

        db_table = "contracts"

        ordering = ["-created_at"]

        constraints = [
            models.UniqueConstraint(
                fields=["agency", "contract_number"],
                name="unique_contract_number_per_agency",
            )
        ]

        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["created_by"]),
            models.Index(fields=["deal"]),
            models.Index(fields=["agency"]),
        ]

    @classmethod
    def generate_contract_number(cls, agency):

        year = timezone.now().year

        last_contract = (
            cls.objects
            .select_for_update()
            .filter(
                agency=agency,
                contract_number__startswith=f"CN-{agency.id}-{year}-",
            )
            .order_by("-contract_number")
            .first()
        )

        if last_contract:
            last_number = int(
                last_contract.contract_number.split("-")[-1]
            )
        else:
            last_number = 0

        next_number = last_number + 1

        return f"CN-{agency.id}-{year}-{next_number:06d}"

    @property
    def is_expired(self):

        return (
            self.end_date is not None
            and self.end_date < timezone.now().date()
        )

    def save(self, *args, **kwargs):

        if not self.contract_number:
            with transaction.atomic():
                self.contract_number = self.generate_contract_number(
                    self.agency
                )

        if self.is_expired:
            self.status = self.Status.EXPIRED

        super().save(*args, **kwargs)

    def __str__(self):
        return self.contract_number



class ContractHistory(models.Model):

    class Action(models.TextChoices):
        CREATE = "create", "ایجاد"
        UPDATE = "update", "ویرایش"
        DELETE = "delete", "حذف"

    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name="histories",
    )

    action = models.CharField(
        max_length=20,
        choices=Action.choices,
    )

    field_name = models.CharField(
        max_length=100,
    )

    old_value = models.TextField(
        blank=True,
    )

    new_value = models.TextField(
        blank=True,
    )

    changed_by = models.ForeignKey(
        "accounts.User",related_name="contract_histories",
        on_delete=models.SET_NULL,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )