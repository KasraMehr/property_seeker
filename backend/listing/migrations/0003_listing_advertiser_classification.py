from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("listing", "0002_listing_contact_phone"),
    ]

    operations = [
        migrations.AddField(
            model_name="listing",
            name="advertiser_classification_error",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="listing",
            name="advertiser_classification_model",
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name="listing",
            name="advertiser_classification_status",
            field=models.CharField(
                choices=[
                    ("pending", "در انتظار"),
                    ("succeeded", "موفق"),
                    ("failed", "ناموفق"),
                ],
                db_index=True,
                default="pending",
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name="listing",
            name="advertiser_classified_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="listing",
            name="advertiser_description_hash",
            field=models.CharField(blank=True, max_length=64),
        ),
        migrations.AddField(
            model_name="listing",
            name="advertiser_type",
            field=models.CharField(
                blank=True,
                choices=[("owner", "مالک"), ("agency", "آژانس املاک")],
                db_index=True,
                max_length=10,
                null=True,
            ),
        ),
        migrations.AddConstraint(
            model_name="listing",
            constraint=models.CheckConstraint(
                condition=(
                    models.Q(
                        advertiser_classification_status="succeeded",
                        advertiser_type__in=["owner", "agency"],
                    )
                    | models.Q(
                        advertiser_classification_status__in=["pending", "failed"],
                        advertiser_type__isnull=True,
                    )
                ),
                name="valid_listing_advertiser_classification",
            ),
        ),
    ]
