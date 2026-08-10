from django.urls import path
from rest_framework.routers import DefaultRouter

from accounts.views.login_views import *
from accounts.views.views import *

router = DefaultRouter()

router.register("users", UserViewSet, basename="users")

router.register(r"agencies", AgencyViewSet, basename="agency")

router.register(r"roles", RoleViewSet, basename="role")

urlpatterns = [
    path("login/", LoginPasswordView.as_view(), name="login"),
    path("logout/", LogOutView.as_view(), name="logout"),
    path("refresh/", RefreshTokenView.as_view(), name="refresh"),
    path("verify/", VerifyTokenView.as_view(), name="verify"),
    path(
        "permissions/",
        PermissionListView.as_view(),
        name="permission-list",
    ),
] + router.urls
