from django.db import models


# Create your models here.
class Customer(models.Model):

    class CustomerType(models.TextChoices):
        BUYER = "buyer", "خریدار"
        SELLER = "seller", "فروشنده"
        TENANT = "tenant", "مستاجر"
        LANDLORD = "landlord", "موجر"
        INVESTOR = "investor", "سرمایه گذار"

    class Status(models.TextChoices):
        NEW = "new", "جدید"
        CONTACTED = "contacted", "تماس گرفته شده"
        INTERESTED = "interested", "علاقه مند"
        NEGOTIATION = "negotiation", "مذاکره"
        CLOSED = "closed", "بسته شده"
        LOST = "lost", "از دست رفته"

    agency = models.ForeignKey(
        "accounts.Agency", on_delete=models.CASCADE, related_name="customers"
    )

    full_name = models.CharField(max_length=255)

    phone = models.CharField(max_length=20, db_index=True)

    tags = models.ManyToManyField("crm.Tag", blank=True, related_name="customers")

    email = models.EmailField(blank=True, null=True)

    customer_type = models.CharField(max_length=20, choices=CustomerType.choices)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)

    assigned_agent = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="customers",
    )

    source = models.CharField(max_length=50, blank=True)

    notes = models.TextField(blank=True)

    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:

        db_table = "customers"

        constraints = [
            models.UniqueConstraint(
                fields=["agency", "phone"], name="unique_customer_phone_per_agency"
            )
        ]


class CustomerPreference(models.Model):

    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name="preferences"
    )

    deal_type = models.CharField(
        max_length=20,
        choices=[
            ("sale", "فروش"),
            ("rent", "اجاره"),
            ("mortgage", "رهن"),
        ],
    )

    property_type = models.CharField(max_length=50, blank=True)

    budget_min = models.BigIntegerField(null=True, blank=True)

    budget_max = models.BigIntegerField(null=True, blank=True)

    area_min = models.PositiveIntegerField(null=True, blank=True)

    area_max = models.PositiveIntegerField(null=True, blank=True)

    bedrooms = models.PositiveSmallIntegerField(null=True, blank=True)

    neighborhoods = models.ManyToManyField("locations.Neighborhood", blank=True)

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)


class Tag(models.Model):

    agency = models.ForeignKey(
        "accounts.Agency", on_delete=models.CASCADE, related_name="tags"
    )

    name = models.CharField(max_length=50)

    class Meta:
        db_table = "customer_tags"

        constraints = [
            models.UniqueConstraint(
                fields=["agency", "name"], name="unique_tag_per_agency"
            )
        ]

    def __str__(self):
        return self.name


from django.db import models


class CallLog(models.Model):

    class CallType(models.TextChoices):
        INCOMING = "incoming", "ورودی"
        OUTGOING = "outgoing", "خروجی"

    class Result(models.TextChoices):
        ANSWERED = "answered", "پاسخ داده شد"
        NO_ANSWER = "no_answer", "پاسخ نداد"
        BUSY = "busy", "مشغول"
        INTERESTED = "interested", "علاقه‌مند"
        NOT_INTERESTED = "not_interested", "عدم تمایل"
        FOLLOW_UP = "follow_up", "نیاز به پیگیری"
        VISIT_BOOKED = "visit_booked", "بازدید ثبت شد"

    agency = models.ForeignKey(
        "accounts.Agency", on_delete=models.CASCADE, related_name="call_logs"
    )

    customer = models.ForeignKey(
        "crm.Customer", on_delete=models.CASCADE, related_name="calls"
    )

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="calls",
    )

    listing = models.ForeignKey(
        "listing.Listing",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="calls",
    )

    handled_by = models.ForeignKey(
        "accounts.User", on_delete=models.PROTECT, related_name="handled_calls"
    )

    call_type = models.CharField(max_length=20, choices=CallType.choices)

    result = models.CharField(max_length=30, choices=Result.choices)

    note = models.TextField(blank=True)

    call_duration = models.PositiveIntegerField(default=0)

    next_follow_up_at = models.DateTimeField(null=True, blank=True)

    follow_up_done = models.BooleanField(default=False)

    record_file = models.FileField(upload_to="calls/", null=True, blank=True)

    called_at = models.DateTimeField()

    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "call_logs"

        ordering = ["-called_at"]

        indexes = [
            models.Index(fields=["customer"]),
            models.Index(fields=["handled_by"]),
            models.Index(fields=["called_at"]),
            models.Index(fields=["result"]),
        ]


from django.db import models


class PropertyVisit(models.Model):

    class Status(models.TextChoices):

        SCHEDULED = "scheduled", "برنامه ریزی شده"
        CONFIRMED = "confirmed", "تایید شده"
        COMPLETED = "completed", "انجام شده"
        CANCELED = "canceled", "لغو شده"
        NO_SHOW = "no_show", "عدم حضور مشتری"

    agency = models.ForeignKey(
        "accounts.Agency", on_delete=models.CASCADE, related_name="property_visits"
    )

    property = models.ForeignKey(
        "properties.Property", on_delete=models.CASCADE, related_name="visits"
    )

    customer = models.ForeignKey(
        "crm.Customer", on_delete=models.CASCADE, related_name="visits"
    )

    agent = models.ForeignKey(
        "accounts.User", on_delete=models.PROTECT, related_name="property_visits"
    )

    visit_date = models.DateTimeField()

    end_date = models.DateTimeField(null=True, blank=True)

    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.SCHEDULED
    )

    customer_feedback = models.TextField(blank=True)

    cancel_reason = models.TextField(blank=True)

    created_by = models.ForeignKey(
        "accounts.User", on_delete=models.PROTECT, related_name="created_visits"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:

        db_table = "property_visits"

        ordering = ["-visit_date"]

        indexes = [
            models.Index(fields=["agency", "status"]),
            models.Index(fields=["visit_date"]),
        ]


from django.db import models


class Reminder(models.Model):

    class Status(models.TextChoices):

        PENDING = "pending", "در انتظار"

        DONE = "done", "انجام شده"

        CANCELED = "canceled", "لغو شده"

    class Type(models.TextChoices):

        CALL = "call", "تماس"

        VISIT = "visit", "بازدید"

        FOLLOW_UP = "follow_up", "پیگیری"

        OTHER = "other", "سایر"

    agency = models.ForeignKey(
        "accounts.Agency", on_delete=models.CASCADE, related_name="reminders"
    )

    user = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="reminders"
    )

    customer = models.ForeignKey(
        "crm.Customer",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="reminders",
    )

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="reminders",
    )

    title = models.CharField(max_length=255)

    type = models.CharField(max_length=20, choices=Type.choices, default=Type.OTHER)

    description = models.TextField(blank=True)

    due_at = (
        models.DateTimeField()
    )  # این یادآوری باید دقیقاً چه روز و چه ساعتی انجام شود؟

    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )

    completed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:

        db_table = "reminders"

        ordering = ["due_at"]

        indexes = [
            models.Index(fields=["agency", "status"]),
            models.Index(fields=["due_at"]),
        ]
