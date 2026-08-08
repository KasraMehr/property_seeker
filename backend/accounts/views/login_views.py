from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from ..serializers.login_serializers import LoginSerializer
from ..serializers.serializers import UserSerializer
from audit.services.activity_log import ActivityLogService


def _set_jwt_cookies(response, refresh_token: RefreshToken):
    simple_jwt = settings.SIMPLE_JWT

    # Access Token Cookie
    response.set_cookie(
        key=simple_jwt["AUTH_COOKIE"],
        value=str(refresh_token.access_token),
        httponly=simple_jwt["AUTH_COOKIE_HTTP_ONLY"],
        secure=simple_jwt["AUTH_COOKIE_SECURE"],
        samesite=simple_jwt["AUTH_COOKIE_SAMESITE"],
        max_age=simple_jwt["ACCESS_TOKEN_LIFETIME_SECONDS"],
        path="/",
    )

    # Refresh Token Cookie (Path اصلاح شده به /)
    response.set_cookie(
        key=simple_jwt["AUTH_COOKIE_REFRESH"],
        value=str(refresh_token),
        httponly=simple_jwt["AUTH_COOKIE_HTTP_ONLY"],
        secure=simple_jwt["AUTH_COOKIE_SECURE"],
        samesite=simple_jwt["AUTH_COOKIE_SAMESITE"],
        max_age=simple_jwt["REFRESH_TOKEN_LIFETIME_SECONDS"],
        path="/",
    )


@method_decorator(csrf_exempt, name="dispatch")
class LoginPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data,context={'request': request} )

        if not serializer.is_valid():
            try:
                ActivityLogService.login_failed(
                    request=request,
                    phone=request.data.get("phone", "UNKNOWN"),
                )
            except Exception:
                pass  # جلوگیری از خطای 500 هنگام ثبت لاگ لغو شده

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        response = Response(
            {
                "message": "ورود با موفقیت انجام شد.",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )

        _set_jwt_cookies(response, refresh)

        try:
            ActivityLogService.login(request=request, user=user)
        except Exception:
            pass

        return response


@method_decorator(csrf_exempt, name="dispatch")  # برای تست CSRF را exempt کنید
class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"])

        if not refresh:
            return Response(
                {"detail": "Refresh token not found in cookies."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = TokenRefreshSerializer(data={"refresh": refresh})

        try:
            serializer.is_valid(raise_exception=True)
        except (TokenError, InvalidToken):
            response = Response(
                {"detail": "Refresh token expired or invalid."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
            response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE"], path="/")
            response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"], path="/")
            return response

        response = Response(
            {"message": "Token refreshed."},
            status=status.HTTP_200_OK,
        )

        _set_jwt_cookies(response, RefreshToken(serializer.validated_data.get("refresh", refresh)))

        return response


class VerifyTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "authenticated": True,
                "user": UserSerializer(request.user).data,
            },
            status=status.HTTP_200_OK,

        )


@method_decorator(csrf_protect, name="dispatch")
class LogOutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        response = Response(
            {"message": "خروج با موفقیت انجام شد."},
            status=status.HTTP_200_OK,
        )

        try:
            refresh_token = request.COOKIES.get(
                settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"]
            )

            if refresh_token:
                RefreshToken(refresh_token).blacklist()

        except (InvalidToken, TokenError):
            pass

        response.delete_cookie(
            settings.SIMPLE_JWT["AUTH_COOKIE"],
            path="/",
        )

        response.delete_cookie(
            settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"],
            path="/",
        )

        ActivityLogService.logout(request)

        return response