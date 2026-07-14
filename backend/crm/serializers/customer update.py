from rest_framework import serializers

from ..models import Customer


class CustomerUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = (
            "full_name",
            "phone",
            "alternate_phone",
            "customer_type",
            "notes",
            "assigned_agent",
        )

    def validate_phone(self, value):
        """
        بررسی یکتا بودن شماره تلفن هنگام ویرایش
        """

        if Customer.objects.exclude(pk=self.instance.pk).filter(phone=value).exists():
            raise serializers.ValidationError(
                "مشتری دیگری با این شماره تلفن وجود دارد."
            )

        return value

    def validate(self, attrs):
        """
        اعتبارسنجی‌های کلی
        """

        phone = attrs.get("phone")

        if phone and len(phone) < 10:
            raise serializers.ValidationError(
                {"phone": "شماره تلفن معتبر نیست."}
            )

        alternate_phone = attrs.get("alternate_phone")

        if (
            phone
            and alternate_phone
            and phone == alternate_phone
        ):
            raise serializers.ValidationError(
                {
                    "alternate_phone": "شماره تلفن اصلی و جایگزین نباید یکسان باشند."
                }
            )

        return attrs

    def update(self, instance, validated_data):

        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.save()

        return instance