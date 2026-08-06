from django.db import models

# Create your models here.

class Commission(models.Model):

    class Status(models.TextChoices):
        PENDING = "pending", "در انتظار"
        APPROVED = "approved", "تایید شده"
        PAID = "paid", "پرداخت شده"
        REJECTED = "rejected", "رد شده"

    """deal = models.ForeignKey(
        "deals.Deal",
        on_delete=models.CASCADE,
        related_name="commissions"
    )"""

    agent = models.ForeignKey(
        "accounts.User",
        on_delete=models.PROTECT,
        related_name="commissions"
    )

    amount = models.BigIntegerField()

    rate = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    due_date = models.DateField(
        null=True,
        blank=True
    )

    paid_at = models.DateTimeField(
        null=True,
        blank=True
    )

    notes = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class SalaryPayment(models.Model):

    class Status(models.TextChoices):
        DRAFT = "draft", "پیش نویس"
        APPROVED = "approved", "تایید شده"
        PAID = "paid", "پرداخت شده"
        CANCELED = "canceled", "لغو شده"

    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="salary_payments"
    )

    month = models.PositiveSmallIntegerField()

    year = models.PositiveSmallIntegerField()

    base_salary = models.BigIntegerField()

    commission_total = models.BigIntegerField(default=0)

    bonus = models.BigIntegerField(default=0)

    deduction = models.BigIntegerField(default=0)

    net_salary = models.BigIntegerField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )

    paid_at = models.DateTimeField(
        null=True,
        blank=True
    )

    note = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class SalaryPaymentItem(models.Model):

    class Type(models.TextChoices):
        BASE = "base", "حقوق پایه"
        COMMISSION = "commission", "کمیسیون"
        BONUS = "bonus", "پاداش"
        DEDUCTION = "deduction", "کسورات"

    salary_payment = models.ForeignKey(
        SalaryPayment,
        on_delete=models.CASCADE,
        related_name="items"
    )

    type = models.CharField(
        max_length=20,
        choices=Type.choices
    )

    title = models.CharField(max_length=255)

    amount = models.BigIntegerField()

    note = models.TextField(blank=True)

class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "category"

class Expense(models.Model):

    title = models.CharField(max_length=255)

    category = models.ForeignKey(Category,on_delete=models.CASCADE,related_name="expenses")

    amount = models.BigIntegerField()

    paid_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="expenses"
    )

    payment_method = models.CharField(max_length=50)

    date = models.DateField()

    note = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)


