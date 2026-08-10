# serializers/login_serializers.py

from django.contrib.auth import authenticate
from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    def validate(self, attrs):
        phone = attrs.get("phone")
        password = attrs.get("password")

        # گرفتن request از context سریالایزر
        request = self.context.get("request")

        # پاس دادن request به عنوان ورودی اول
        user = authenticate(request=request, phone=phone, password=password)

        if user is None:
            raise serializers.ValidationError("شماره موبایل یا رمز عبور اشتباه است.")

        if not user.is_active:
            raise serializers.ValidationError("حساب کاربری غیرفعال است.")

        attrs["user"] = user
        return attrs
