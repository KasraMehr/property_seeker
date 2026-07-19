from django.utils import timezone
from django.db import models

from django.db import transaction

# Create your models here.
class Owner(models.Model):
    full_name = models.CharField(max_length=255)

    phone = models.CharField(
        max_length=20,
        db_index=True
    )

    alternate_phone = models.CharField(
        max_length=20,
        blank=True
    )

    national_id = models.CharField(
        max_length=20,
        blank=True
    )

    notes = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "owners"

    def __str__(self):
        return self.full_name


class Property(models.Model):

    class DealType(models.TextChoices):
        SALE = "sale", "فروش"
        RENT = "rent", "اجاره"
        MORTGAGE = "mortgage", "رهن کامل"
        EXCHANGE = "exchange","معاوضه"

    class Status(models.TextChoices):
        AVAILABLE = "available", "فعال"
        RESERVED = "reserved", "رزرو"
        SOLD = "sold", "فروخته شده"
        RENTED = "rented", "اجاره داده شده"
        ARCHIVED = "archived", "بایگانی"

    property_code = models.CharField(
        max_length=50,
        unique=True,editable=False
    )

    owner = models.ForeignKey(
        "properties.Owner",
        on_delete=models.PROTECT,
        related_name="properties"
    )

    agent = models.ForeignKey(
        "accounts.User",
        on_delete=models.PROTECT,
        related_name="create_by"
    )

    address = models.ForeignKey(
        "locations.Address",
        on_delete=models.PROTECT,null=True,blank=True
    )

    title = models.CharField(
        max_length=255
    )

    property_type = models.CharField(
        max_length=30,null=True,blank=True
    )

    deal_type = models.CharField(
        max_length=30,
        choices=DealType.choices
    )

    area = models.PositiveIntegerField()

    floor = models.PositiveIntegerField(
        null=True,
        blank=True
    )
    create_by =  models.ForeignKey(
        "accounts.User",
        on_delete=models.PROTECT,
        related_name="managed_properties",
    )
    total_floors = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    age = models.PositiveIntegerField(
        default=0
    )

    bedrooms = models.PositiveSmallIntegerField(
        default=0
    )

    bathrooms = models.PositiveSmallIntegerField(
        default=0
    )

    parking_count = models.PositiveSmallIntegerField(
        default=0
    )

    storage_count = models.PositiveSmallIntegerField(
        default=0
    )

    orientation = models.CharField(
        max_length=50,
        blank=True
    )

    condition = models.CharField(
        max_length=100,
        blank=True
    )

    description = models.TextField(
        blank=True
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

    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.AVAILABLE
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "properties"

    def __str__(self):
        return self.property_code

    @classmethod
    def generate_property_code(cls):
        year = timezone.now().year

        last_deal = (
            cls.objects
            .select_for_update()
            .filter(property_code__startswith=f"DL-{year}-")
            .order_by("-property_code")
            .first()
        )

        if last_deal:
            last_number = int(last_deal.property_code.split("-")[-1])
        else:
            last_number = 0

        next_number = last_number + 1

        return f"DL-{year}-{next_number:06d}"

    def save(self, *args, **kwargs):

        if not self.property_code:
            with transaction.atomic():
                self.property_code =Property.generate_property_code()

        super().save(*args, **kwargs)



class Feature(models.Model):
    title = models.CharField(
        max_length=100,
        unique=True
    )

    class Meta:
        db_table = "features"

    def __str__(self):
        return self.title

class PropertyFeature(models.Model):

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="property_features"
    )

    feature = models.ForeignKey(
        Feature,
        on_delete=models.CASCADE
    )

    class Meta:
        db_table = "property_features"

        unique_together = (
            "property",
            "feature"
        )


class Media(models.Model):

    class MediaType(models.TextChoices):
        IMAGE = "image", "تصویر"
        VIDEO = "video", "ویدئو"

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="media"
    )

    listing = models.ForeignKey(
        "listing.Listing",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    file = models.FileField(
        upload_to="properties/"
    )

    media_type = models.CharField(
        max_length=20,
        choices=MediaType.choices
    )

    is_main = models.BooleanField(
        default=False
    )

    sort_order = models.PositiveIntegerField(
        default=0
    )

    alt_text = models.CharField(
        max_length=255,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "property_media"
        ordering = [
            "sort_order",
            "-created_at"
        ]


class PropertyStatusHistory(models.Model):

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE
    )

    old_status = models.CharField(
        max_length=30,
        choices=Property.Status.choices,
    )

    new_status = models.CharField(
        max_length=30,
        choices=Property.Status.choices,
    )
    changed_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


class PropertyHistory(models.Model):

    class Action(models.TextChoices):
        CREATE = "create", "ایجاد"
        UPDATE = "update", "ویرایش"
        DELETE = "delete", "حذف"

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="history"
    )

    action = models.CharField(
        max_length=20,
        choices=Action.choices
    )

    field_name = models.CharField(
        max_length=100
    )

    old_value = models.TextField(
        null=True,
        blank=True
    )

    new_value = models.TextField(
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
        db_table = "property_history"
        ordering = ["-created_at"]