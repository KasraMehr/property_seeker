from rest_framework.routers import DefaultRouter
from accounts.views.views import UserViewSet
from accounts.views.login_views import *
from django.urls import path


router = DefaultRouter()

router.register(
    "users",
    UserViewSet,
    basename="users"
)
urlpatterns = [
path("login/", LoginPasswordView.as_view(), name="login"),
path("logout/", LogOutView.as_view(), name="logout"),
path("refresh/", RefreshTokenView.as_view(), name="refresh"),
path("verify/", VerifyTokenView.as_view(), name="verify"),
]+router.urls