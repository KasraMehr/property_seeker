from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from .models import User

from django.contrib.auth.backends import BaseBackend

from .models import User


class PhoneBackend(BaseBackend):

    def authenticate(self, request, phone=None, password=None, **kwargs):

        if phone is None or password is None:
            return None

        try:
            user = User.objects.get(phone=phone)

        except User.DoesNotExist:
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user

        return None

    def get_user(self, user_id):

        try:
            return User.objects.get(pk=user_id)

        except User.DoesNotExist:
            return None

    def user_can_authenticate(self, user):

        return user.is_active

"""

ن کلاس برای احراز هویت با JWT از طریق Cookie است.

به طور پیش‌فرض JWTAuthentication در کتابخانه SimpleJWT توکن را از هدر Authorization می‌خواند:

Authorization: Bearer eyJhbGciOi...

اما تو می‌خواهی توکن داخل Cookie باشد، نه Header.
در اخر کاربر از دیتابیس پیدا میکند و میفرستد
"""
class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        cookie_name = getattr(settings, "SIMPLE_JWT", {}).get("AUTH_COOKIE", "access")
        raw_token = request.COOKIES.get(cookie_name)

        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)

        except (TokenError, InvalidToken):
            return None

        return self.get_user(validated_token), validated_token