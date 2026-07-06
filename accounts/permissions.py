from rest_framework.permissions import BasePermission


class IsAgencyOwner(BasePermission):

    message = "Only the agency owner can create users."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.is_owner
        )