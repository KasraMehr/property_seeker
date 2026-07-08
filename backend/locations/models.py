from django.db import models

# Create your models here.
class Province(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "provinces"

    def __str__(self):
        return self.name

class City(models.Model):
    province = models.ForeignKey(
        Province,
        on_delete=models.CASCADE,
        related_name="cities"
    )

    name = models.CharField(
        max_length=100
    )

    class Meta:
        db_table = "cities"

    def __str__(self):
        return self.name

class District(models.Model):
    city = models.ForeignKey(
        City,
        on_delete=models.CASCADE,
        related_name="districts"
    )

    name = models.CharField(
        max_length=100
    )

    class Meta:
        db_table = "districts"

    def __str__(self):
        return self.name


class Neighborhood(models.Model):
    district = models.ForeignKey(
        District,
        on_delete=models.CASCADE,
        related_name="neighborhoods"
    )

    name = models.CharField(
        max_length=100
    )

    class Meta:
        db_table = "neighborhoods"

    def __str__(self):
        return self.name


class Address(models.Model):

    neighborhood = models.ForeignKey(
        Neighborhood,
        on_delete=models.PROTECT,
        related_name="addresses"
    )

    street = models.CharField(
        max_length=255,
        blank=True
    )

    alley = models.CharField(
        max_length=255,
        blank=True
    )

    plaque = models.CharField(
        max_length=20,
        blank=True
    )

    unit = models.CharField(
        max_length=20,
        blank=True
    )

    postal_code = models.CharField(
        max_length=20,
        blank=True
    )

    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True
    )

    longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True
    )

    full_text = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "addresses"

    def __str__(self):
        return self.full_text

