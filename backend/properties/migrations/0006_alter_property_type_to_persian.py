"""
Data migration: Convert English property_type values to Persian.

Before: APARTMENT, VILLA, LAND, COMMERCIAL, OFFICE, STORE
After:  آپارتمان, ویلا, زمین, تجاری, دفتر, مغازه
"""

from django.db import migrations


PROPERTY_TYPE_MAP = {
    "APARTMENT": "آپارتمان",
    "VILLA": "ویلا",
    "LAND": "زمین",
    "COMMERCIAL": "تجاری",
    "OFFICE": "دفتر",
    "STORE": "مغازه",
}


def forwards(apps, schema_editor):
    Property = apps.get_model("properties", "Property")
    for old, new in PROPERTY_TYPE_MAP.items():
        Property.objects.filter(property_type=old).update(property_type=new)


def backwards(apps, schema_editor):
    Property = apps.get_model("properties", "Property")
    for old, new in PROPERTY_TYPE_MAP.items():
        Property.objects.filter(property_type=new).update(property_type=old)


class Migration(migrations.Migration):

    dependencies = [
        ("properties", "0005_alter_property_deal_type"),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
