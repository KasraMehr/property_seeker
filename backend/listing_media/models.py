from django.db import models

# Create your models here.

class Media(models.Model):

    class MediaType(models.TextChoices):
        IMAGE = "image", "تصویر"
        VIDEO = "video", "ویدئو"
        DOCUMENT = "document", "سند"

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,

        related_name="media",
        null=True,
        blank=True,
    )

    listing = models.ForeignKey(
        "listing.Listing",
        on_delete=models.CASCADE,
        related_name="media",
        null=True,
        blank=True,
    )

    file = models.FileField(
        upload_to="media/"
    )

    file_name = models.CharField(
        max_length=255
    )

    media_type = models.CharField(
        max_length=20,
        choices=MediaType.choices
    )

    mime_type = models.CharField(#نوع واقعی فایل
        max_length=100
    )

    file_size = models.BigIntegerField()

    width = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    height = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    duration = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Duration in seconds",
    )#مدت زمان ویدئو

    checksum = models.CharField(
        max_length=64,
        blank=True,
    )#معمولاً مقدار SHA256 فایل است.
    """کاربردها:

تشخیص فایل تکراری
بررسی خراب نشدن فایل
اطمینان از یکسان بودن فایل

اگر دو فایل checksum یکسان داشته باشند یعنی محتوا کاملاً یکسان است."""

    alt_text = models.CharField(
        max_length=255,
        blank=True,
    )

    is_main = models.BooleanField(
        default=False
    )

    sort_order = models.PositiveIntegerField(
        default=0
    )

    uploaded_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="uploaded_media",
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "media"
        ordering = [
            "sort_order",
            "-created_at",
        ]

    def __str__(self):
        return self.file_name