from rest_framework.permissions import BasePermission
from django.contrib.auth.models import Permission
class IsAgencyOwner(BasePermission):
    """
    فقط صاحب آژانس (is_owner=True) اجازه دارد.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "is_owner", False)
        )


class HasRolePermission(BasePermission):
    """
    چک می‌کند که آیا کاربر پرمیشن مورد نیاز را دارد؛
    یا از طریق دسترسی‌های مستقیم (user_permissions)
    یا از طریق نقش‌های (Role) کاربر.
    """

    def has_permission(self, request, view):
        user = request.user

        # کاربر لاگین نباشد
        if not user or not user.is_authenticated:
            return False

        # Owner یا Superuser همه چیز را می‌تواند
        if getattr(user, "is_owner", False) or user.is_superuser:
            return True

        # اگر ویو required_permission تعریف نکرده باشد، اجازه بده
        required_permission = getattr(view, "required_permission", None)
        if not required_permission:
            return True

        # چک کردن دسترسی‌های مستقیم کاربر
        # (دسترسی‌هایی که هنگام ساخت/ویرایش کاربر به او داده شده)
        if user.user_permissions.filter(
            codename=required_permission
        ).exists():
            return True

        # چک کردن پرمیشن از طریق نقش‌های کاربر
        # user.role → ManyToMany manager
        return user.role.filter(
            permissions__codename=required_permission
        ).exists()