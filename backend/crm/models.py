from django.db import models

# Create your models here.

class Customer(models.Model):

    class CustomerType(models.TextChoices):
        BUYER = "buyer", "خریدار"
        RENTER = "renter", "مستاجر"
        INVESTOR = "investor", "سرمایه گذار"

    full_name = models.CharField(
        max_length=255
    )

    phone = models.CharField(
        max_length=20,
        unique=True,
        db_index=True
    )

    alternate_phone = models.CharField(
        max_length=20,
        unique=True,
        blank=True
    )

    customer_type = models.CharField(
        max_length=20,
        choices=CustomerType.choices
    )

    notes = models.TextField(
        blank=True
    )

    assigned_agent = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="customers"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "customers"




class CustomerPreference(models.Model):

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="preferences"
    )

    deal_type = models.CharField(
        max_length=20
    )

    property_type = models.CharField(
        max_length=50
    )

    budget_min = models.BigIntegerField(
        null=True,
        blank=True
    )

    budget_max = models.BigIntegerField(
        null=True,
        blank=True
    )

    neighborhood = models.ForeignKey(
        "locations.Neighborhood",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


class CustomerTag(models.Model):

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE
    )

    tag = models.CharField(
        max_length=50
    )

class CallLog(models.Model):

    class CallType(models.TextChoices):
        INCOMING = "incoming", "ورودی"
        OUTGOING = "outgoing", "خروجی"

    class Result(models.TextChoices):
        ANSWERED = "answered", "پاسخ داده شد"
        NO_ANSWER = "no_answer", "پاسخ نداد"
        BUSY = "busy", "مشغول"
        INTERESTED = "interested", "علاقه مند"
        NOT_INTERESTED = "not_interested", "عدم تمایل"
        FOLLOW_UP = "follow_up", "نیاز به پیگیری"
        VISIT_BOOKED = "visit_booked", "بازدید ثبت شد"

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="calls"
    )

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    listing = models.ForeignKey(
        "listing.Listing",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    handled_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.PROTECT,
        related_name="handled_calls"
    )

    call_type = models.CharField(
        max_length=20,
        choices=CallType.choices
    )

    result = models.CharField(
        max_length=30,
        choices=Result.choices
    )

    note = models.TextField(
        blank=True
    )

    call_duration = models.PositiveIntegerField(
        default=0
    )

    next_follow_up_at = models.DateTimeField(
        null=True,
        blank=True
    )

    called_at = models.DateTimeField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "call_logs"
        ordering = ["-called_at"]





class PropertyVisit(models.Model):

    class Status(models.TextChoices):
        SCHEDULED = "scheduled", "برنامه ریزی شده"
        COMPLETED = "completed", "انجام شده"
        CANCELED = "canceled", "لغو شده"
        NO_SHOW = "no_show", "عدم حضور مشتری"

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="visits"
    )

    customer = models.ForeignKey(
        "crm.Customer",
        on_delete=models.CASCADE,
        related_name="visits"
    )

    agent = models.ForeignKey(
        "accounts.User",
        on_delete=models.PROTECT,
        related_name="property_visits"
    )

    visit_date = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SCHEDULED
    )

    feedback = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "property_visits"
        ordering = ["-visit_date"]


class Reminder(models.Model):

    class Status(models.TextChoices):
        PENDING = "pending", "در انتظار"
        DONE = "done", "انجام شده"
        CANCELED = "canceled", "لغو شده"

    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="reminders"
    )

    customer = models.ForeignKey(
        "crm.Customer",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="reminders"
    )

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    title = models.CharField(
        max_length=255
    )

    description = models.TextField(
        blank=True
    )

    due_at = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "reminders"
        ordering = ["due_at"]

