from django.db import models
from django.db.models import Q
from django.utils import timezone

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

    class ReviewStatus(models.TextChoices):
        UNREVIEWED = "unreviewed", "بررسی نشده"
        SHORTLISTED = "shortlisted", "منتخب"
        REJECTED = "rejected", "رد شده"
        PROMOTED = "promoted", "تبدیل به ملک"

    class AdvertiserType(models.TextChoices):
        OWNER = "owner", "مالک"
        AGENCY = "agency", "آژانس املاک"

    class AdvertiserClassificationStatus(models.TextChoices):
        PENDING = "pending", "در انتظار"
        SUCCEEDED = "succeeded", "موفق"
        FAILED = "failed", "ناموفق"

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.SET_NULL,
        related_name="listings",
        null=True,
        blank=True,
    )

    source = models.ForeignKey(
        Source, on_delete=models.PROTECT, related_name="listings"
    )

    external_id = models.CharField(
        max_length=100,
        blank=True,
        db_index=True,
    )

    url = models.URLField(
        max_length=1000,
        blank=True,
    )

    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.DRAFT
    )

    review_status = models.CharField(
        max_length=20,
        choices=ReviewStatus.choices,
        default=ReviewStatus.UNREVIEWED,
        db_index=True,
    )

    title = models.CharField(max_length=255)

    contact_phone = models.CharField(
        max_length=20,
        blank=True,
        default="",
        db_index=True,
    )

    description = models.TextField(blank=True)

    advertiser_type = models.CharField(
        max_length=10,
        choices=AdvertiserType.choices,
        null=True,
        blank=True,
        db_index=True,
    )

    advertiser_classification_status = models.CharField(
        max_length=10,
        choices=AdvertiserClassificationStatus.choices,
        default=AdvertiserClassificationStatus.PENDING,
        db_index=True,
    )

    advertiser_classification_model = models.CharField(max_length=100, blank=True)

    advertiser_classified_at = models.DateTimeField(null=True, blank=True)

    advertiser_description_hash = models.CharField(max_length=64, blank=True)

    advertiser_classification_error = models.TextField(blank=True)

    listed_sale_price = models.BigIntegerField(null=True, blank=True)

    listed_price_per_meter = models.BigIntegerField(
        null=True,
        blank=True,
    )

    listed_mortgage_amount = models.BigIntegerField(
        null=True,
        blank=True,
    )

    listed_deposit_amount = models.BigIntegerField(null=True, blank=True)

    listed_rent_amount = models.BigIntegerField(null=True, blank=True)

    listed_area = models.PositiveIntegerField(null=True, blank=True)

    build_year = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
    )

    room_count = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
    )

    floor_number = models.IntegerField(
        null=True,
        blank=True,
    )

    total_floors = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
    )

    pictures_match_property = models.BooleanField(
        null=True,
        blank=True,
    )

    media_count = models.PositiveIntegerField(default=0)

    views_count = models.PositiveIntegerField(default=0)

    leads_count = models.PositiveIntegerField(default=0)

    published_at = models.DateTimeField(null=True, blank=True)

    source_updated_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    expires_at = models.DateTimeField(null=True, blank=True)

    created_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        related_name="created_listings",
        null=True,
        blank=True,
    )

    first_seen_at = models.DateTimeField(
        default=timezone.now,
        db_index=True,
    )

    last_seen_at = models.DateTimeField(
        default=timezone.now,
        db_index=True,
    )

    last_checked_at = models.DateTimeField(
        null=True,
        blank=True,
        db_index=True,
    )

    last_changed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    consecutive_failures = models.PositiveSmallIntegerField(default=0)

    removal_detected_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    content_hash = models.CharField(
        max_length=64,
        blank=True,
        db_index=True,
    )

    latest_payload = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "listings"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["source", "external_id"],
                condition=~Q(external_id=""),
                name="unique_listing_source_external_id",
            ),
            models.CheckConstraint(
                condition=(
                    Q(
                        advertiser_classification_status="succeeded",
                        advertiser_type__in=["owner", "agency"],
                    )
                    | Q(
                        advertiser_classification_status__in=["pending", "failed"],
                        advertiser_type__isnull=True,
                    )
                ),
                name="valid_listing_advertiser_classification",
            ),
        ]
        indexes = [
            models.Index(fields=["source", "status", "last_checked_at"]),
            models.Index(fields=["review_status", "last_checked_at"]),
        ]
        permissions = [
                ("promote_listing", "Can promote listing"),
            ]

    def __str__(self):
        return self.title


class ListingStatusHistory(models.Model):

    listing = models.ForeignKey(
        Listing, on_delete=models.CASCADE, related_name="status_history"
    )

    old_status = models.CharField(max_length=20, choices=Listing.Status.choices)

    new_status = models.CharField(max_length=20, choices=Listing.Status.choices)

    reason = models.TextField(blank=True)

    changed_by = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
