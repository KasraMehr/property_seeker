from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.models import User
from accounts.serializers.serializers import (
    UserSerializer,
    UserCreateSerializer,
    UserUpdateSerializer
)
from accounts.permissions import IsAgencyOwner


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = (
           IsAuthenticated,
           IsAgencyOwner,)


    def get_queryset(self):
        return User.objects.filter(
            agency=self.request.user.agency
        ).select_related(
            "role",
            "agency"
        )

    def get_serializer_class(self):

        if self.action == "create":
            return UserCreateSerializer

        if self.action in ("update", "partial_update"):
            return UserUpdateSerializer

        return UserSerializer


