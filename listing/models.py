from django.db import models

# Create your models here.

class Source(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "sources"

    def __str__(self):
        return self.name

class Listing(models.Model):

    class Status(models.TextChoices):
        DRAFT = "draft", "پیش نویس"
        ACTIVE = "active", "فعال"
        PAUSED = "paused", "متوقف"
        SOLD = "sold", "فروخته شده"
        RENTED = "rented", "اجاره داده شده"
        EXPIRED = "expired", "منقضی شده"
        ARCHIVED = "archived", "آرشیو"

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="listings"
    )

    source = models.ForeignKey(
        Source,
        on_delete=models.PROTECT,
        related_name="listings"
    )

    external_id = models.CharField(
        max_length=100,
        blank=True
    )

    url = models.URLField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )

    title = models.CharField(
        max_length=255
    )

    description = models.TextField(
        blank=True
    )

    listed_sale_price = models.BigIntegerField(
        null=True,
        blank=True
    )

    listed_deposit_amount = models.BigIntegerField(
        null=True,
        blank=True
    )

    listed_rent_amount = models.BigIntegerField(
        null=True,
        blank=True
    )

    listed_area = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    media_count = models.PositiveIntegerField(
        default=0
    )

    views_count = models.PositiveIntegerField(
        default=0
    )

    leads_count = models.PositiveIntegerField(
        default=0
    )

    published_at = models.DateTimeField(
        null=True,
        blank=True
    )

    expires_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.PROTECT,
        related_name="created_listings"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "listings"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class ListingStatusHistory(models.Model):

    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
        related_name="status_history"
    )

    old_status = models.CharField(
        max_length=20,
        choices=Listing.Status.choices
    )

    new_status = models.CharField(
        max_length=20,
        choices=Listing.Status.choices
    )

    reason = models.TextField(
        blank=True
    )

    changed_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]

