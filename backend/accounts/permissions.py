from rest_framework.permissions import BasePermission


class IsAgencyOwner(BasePermission):

    message = "Only the agency owner can create users."

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_owner


class HasRolePermission(BasePermission):

    def has_permission(self, request, view):

        # سوپریوزر همیشه اجازه دارد
        if request.user.is_superuser:
            return True

        # اگر رول نداشت
        if not request.user.role:
            return False

        # اسم پرمیشنی که View می‌خواهد
        required_permission = getattr(view, "required_permission", None)

        if not required_permission:
            return False

        # آیا رول این پرمیشن را دارد؟
        return request.user.role.permissions.filter(
            codename=required_permission
        ).exists()
