from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    Permission,
    PermissionsMixin,
)
from django.core.validators import RegexValidator
from django.db import models


# =========================
# Agency
# =========================
class Agency(models.Model):
    name = models.CharField(
        max_length=255,
        unique=True,
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
    )

    address = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "agencies"

    def __str__(self):
        return self.name


# =========================
# Role
# =========================
class Role(models.Model):
    agency = models.ForeignKey(
        Agency,
        on_delete=models.CASCADE,
        related_name="roles",
    )

    name = models.CharField(
        max_length=100,
    )

    description = models.TextField(
        blank=True,
    )

    permissions = models.ManyToManyField(
        Permission,
        blank=True,
        related_name="agency_roles",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "roles"
        constraints = [
            models.UniqueConstraint(
                fields=["agency", "name"],
                name="unique_role_per_agency",
            )
        ]

    def __str__(self):
        return f"{self.agency.name} - {self.name}"


# =========================
# User Manager
# =========================
class UserManager(BaseUserManager):

    # M2M fields that cannot be passed to model() and must be set after save()
    _M2M_FIELDS = ("role", "service_neighborhoods")

    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError("Phone number is required")

        # Extract M2M fields before model instantiation
        m2m = {}
        for field in self._M2M_FIELDS:
            if field in extra_fields:
                m2m[field] = extra_fields.pop(field)

        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        # Set M2M relations after save()
        for field, value in m2m.items():
            getattr(user, field).set(value if isinstance(value, (list, tuple)) else [value])

        return user

    def create_superuser(self, phone, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        return self.create_user(
            phone,
            password,
            **extra_fields,
        )



class DealTypeScope(models.TextChoices):
    RENT_RESIDENTIAL = "rent-residential", "اجارهٔ مسکونی"
    BUY_RESIDENTIAL = "buy-residential", "فروش مسکونی"
    BUY_COMMERCIAL = "buy-commercial-property", "فروش اداری و تجاری"
    RENT_COMMERCIAL = "rent-commercial-property", "اجارهٔ اداری و تجاری"


class User(AbstractBaseUser, PermissionsMixin):
    agency = models.ForeignKey(
        "accounts.Agency",
        on_delete=models.CASCADE,
        related_name="users",
        null=True,
        blank=True,
    )

    service_neighborhoods = models.ManyToManyField(
        "locations.DivarNeighborhood",
        related_name="agents",
        blank=True,
    )

    role = models.ManyToManyField(
        "accounts.Role",
        blank=True,
    )

    full_name = models.CharField(
        max_length=255,
    )

    phone = models.CharField(
        max_length=11,
        unique=True,
        validators=[
            RegexValidator(
                r"^09\d{9}$",
                "شماره موبایل معتبر نیست.",
            )
        ],
    )

    national_id = models.CharField(
        max_length=20,
        unique=True,
    )

    is_owner = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    deal_type_scope = models.CharField(
        max_length=40,
        choices=DealTypeScope.choices,
        default=DealTypeScope.RENT_RESIDENTIAL,
        verbose_name="نوع معامله",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "phone"

    REQUIRED_FIELDS = [
        "full_name",
        "national_id",
    ]

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.full_name

    def can_access_deal_type(self, deal_type: str) -> bool:
        return self.is_owner or self.deal_type_scope == deal_type