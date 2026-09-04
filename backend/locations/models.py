from django.db import models
from django.db.models import Q

from .normalization import normalize_persian


# Create your models here.
class Province(models.Model):
    name = models.CharField(max_length=100, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "provinces"

    def __str__(self):
        return self.name


class City(models.Model):
    province = models.ForeignKey(
        Province, on_delete=models.CASCADE, related_name="cities"
    )

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, blank=True, default="", db_index=True)

    class Meta:
        db_table = "cities"
        constraints = [
            models.UniqueConstraint(
                fields=["slug"],
                condition=~Q(slug=""),
                name="unique_nonempty_city_slug",
            ),
        ]

    def __str__(self):
        return self.name


class District(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="districts")

    name = models.CharField(max_length=100)

    class Meta:
        db_table = "districts"

    def __str__(self):
        return self.name


class Neighborhood(models.Model):
    district = models.ForeignKey(
        District, on_delete=models.CASCADE, related_name="neighborhoods"
    )

    name = models.CharField(max_length=100)

    class Meta:
        db_table = "neighborhoods"

    def __str__(self):
        return self.name


class Zone(models.Model):
    """A stable, CRM-owned grouping of Divar neighborhoods."""

    id = models.SlugField(primary_key=True, max_length=100)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="zones")
    name = models.CharField(max_length=100)
    active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "zones"
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(
                fields=["city", "name"], name="unique_zone_name_per_city"
            ),
        ]

    def __str__(self):
        return self.name


class DivarNeighborhood(models.Model):
    """Canonical external neighborhood returned by Divar.

    ``zone`` is deliberately nullable: synchronization never guesses a CRM
    mapping for a newly introduced Divar neighborhood.
    """

    city = models.ForeignKey(
        City, on_delete=models.CASCADE, related_name="divar_neighborhoods"
    )
    zone = models.ForeignKey(
        Zone,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="divar_neighborhoods",
    )
    name = models.CharField(max_length=150)
    normalized_name = models.CharField(max_length=150)
    source = models.CharField(max_length=30, default="divar", editable=False)
    active = models.BooleanField(default=True, db_index=True)
    last_seen_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "divar_neighborhoods"
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(
                fields=["city", "normalized_name"],
                name="unique_divar_neighborhood_city_normalized_name",
            ),
        ]
        indexes = [models.Index(fields=["city", "zone", "active"])]

    def save(self, *args, **kwargs):
        self.normalized_name = normalize_persian(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Address(models.Model):

    neighborhood = models.ForeignKey(
        Neighborhood, on_delete=models.PROTECT, related_name="addresses"
    )

    agency = models.ForeignKey(
        "accounts.Agency",
        on_delete=models.CASCADE,
        related_name="addresses",
    )

    street = models.CharField(max_length=255, blank=True)

    alley = models.CharField(max_length=255, blank=True)

    plaque = models.CharField(max_length=20, blank=True)

    unit = models.CharField(max_length=20, blank=True)

    postal_code = models.CharField(max_length=20, blank=True)

    latitude = models.DecimalField(
        max_digits=10, decimal_places=7, null=True, blank=True
    )

    longitude = models.DecimalField(
        max_digits=10, decimal_places=7, null=True, blank=True
    )

    full_text = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "addresses"

    def __str__(self):
        return self.full_text
