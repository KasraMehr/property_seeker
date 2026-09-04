import re

from django.db import migrations


FARDIS_ZONES = (
    (
        "fardis-central",
        "مرکز فردیس",
        (
            "فردیس ۱",
            "فردیس ۲",
            "فردیس ۳",
            "فردیس ۴",
            "فردیس ۵",
            "فردیس ۶",
            "فردیس ۷",
            "فردیس ۸",
            "فردیس ۹",
            "فردیس ۱۰",
            "فردیس ۱۲",
            "فردیس ۱۸",
        ),
    ),
    (
        "fardis-ghoreishi",
        "قریشی و کانال",
        ("قریشی", "خیام شرقی", "نسترن شرقی", "شهرک سپاه", "سرحدی"),
    ),
    (
        "fardis-naz",
        "ناز و طالقانی",
        ("شهرک ناز", "طالقانی", "فرامرزیه"),
    ),
    (
        "fardis-manzarieh",
        "منظریه و راه‌آهن",
        ("منظریه", "شهرک راه آهن", "نیروگاه برق"),
    ),
    (
        "fardis-eram",
        "ارم و نگارستان",
        ("شهرک ارم", "شهرک شهید حسینی", "نگارستان", "شهرک ۱۱۰"),
    ),
    ("fardis-vahdat", "وحدت", ("شهرک وحدت",)),
    (
        "fardis-sarhadabad",
        "سرحدآباد و ثابتی",
        ("سرحد آباد", "ثابتی"),
    ),
)


def normalize_persian(value):
    return re.sub(r"\s+", " ", value.replace("ي", "ی").replace("ك", "ک").strip())


def seed_fardis(apps, schema_editor):
    Province = apps.get_model("locations", "Province")
    City = apps.get_model("locations", "City")
    Zone = apps.get_model("locations", "Zone")
    DivarNeighborhood = apps.get_model("locations", "DivarNeighborhood")

    city = City.objects.filter(name="فردیس").first()
    if city is None:
        province, _ = Province.objects.get_or_create(name="البرز")
        city = City.objects.create(province=province, name="فردیس", slug="fardis")
    elif city.slug != "fardis":
        city.slug = "fardis"
        city.save(update_fields=["slug"])

    for zone_id, zone_name, neighborhoods in FARDIS_ZONES:
        zone, _ = Zone.objects.update_or_create(
            id=zone_id,
            defaults={"city": city, "name": zone_name, "active": True},
        )
        for name in neighborhoods:
            normalized_name = normalize_persian(name)
            item, created = DivarNeighborhood.objects.get_or_create(
                city=city,
                normalized_name=normalized_name,
                defaults={
                    "name": name,
                    "zone": zone,
                    "source": "divar",
                    "active": True,
                },
            )
            if not created and item.zone_id is None:
                item.zone = zone
                item.save(update_fields=["zone"])


class Migration(migrations.Migration):
    dependencies = [("locations", "0002_divarneighborhood_zone_city_slug_and_more")]

    operations = [migrations.RunPython(seed_fardis, migrations.RunPython.noop)]
