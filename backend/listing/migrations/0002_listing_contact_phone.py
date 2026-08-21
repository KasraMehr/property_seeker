from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("listing", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="listing",
            name="contact_phone",
            field=models.CharField(
                blank=True,
                db_index=True,
                default="",
                max_length=20,
            ),
        ),
    ]
