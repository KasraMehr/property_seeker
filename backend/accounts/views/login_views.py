from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from ..serializers.login_serializers import  *
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from ..serializers.login_serializers import *
from ..serializers.serializers import *
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

def _set_jwt_cookies(response, refresh_token: RefreshToken):
    simple_jwt = settings.SIMPLE_JWT

    response.set_cookie(
        key=simple_jwt["AUTH_COOKIE"],
        value=str(refresh_token.access_token),
        httponly=simple_jwt["AUTH_COOKIE_HTTP_ONLY"],
        secure=simple_jwt["AUTH_COOKIE_SECURE"],
        samesite=simple_jwt["AUTH_COOKIE_SAMESITE"],
        max_age=simple_jwt["ACCESS_TOKEN_LIFETIME_SECONDS"],
        path="/",
    )

    response.set_cookie(
        key=simple_jwt["AUTH_COOKIE_REFRESH"],
        value=str(refresh_token),
        httponly=simple_jwt["AUTH_COOKIE_HTTP_ONLY"],
        secure=simple_jwt["AUTH_COOKIE_SECURE"],
        samesite=simple_jwt["AUTH_COOKIE_SAMESITE"],
        max_age=simple_jwt["REFRESH_TOKEN_LIFETIME_SECONDS"],
        path="/api/accounts/refresh/",
    )


@method_decorator(csrf_exempt, name="dispatch")
class LoginPasswordView(APIView):

    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        print("LOGIN VIEW CALLED")
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

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

        return response


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

        return response


#refresh token accsess token

@method_decorator(csrf_protect, name="dispatch")
class RefreshTokenView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        refresh = request.COOKIES.get(
            settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"]
        )

        if not refresh:
            return Response(
                {"detail": "Refresh token not found."},
                status=401,
            )

        serializer = TokenRefreshSerializer(
            data={"refresh": refresh}
        )

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError:
            response = Response(
                {"detail": "Refresh token expired."},
                status=401,
            )

            response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE"])
            response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"])

            return response

        response = Response(
            {"message": "Token refreshed."},
            status=200,
        )

        response.set_cookie(
            key=settings.SIMPLE_JWT["AUTH_COOKIE"],
            value=serializer.validated_data["access"],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME_SECONDS"],
            path="/",
        )

        if "refresh" in serializer.validated_data:
            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"],
                value=serializer.validated_data["refresh"],
                httponly=True,
                secure=False,
                samesite="Lax",
                max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME_SECONDS"],
                path="/api/accounts/refresh/"
            )

        return response



from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


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