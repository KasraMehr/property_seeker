import django_filters
from django.db.models import Q

from accounts.models import User


class UserFilter(django_filters.FilterSet):

    # =========================
    # Role
    # =========================

    role = django_filters.BaseInFilter(
        field_name="role",
        lookup_expr="in",
    )

    # =========================
    # Basic fields
    # =========================

    is_active = django_filters.BooleanFilter(
        field_name="is_active"
    )

    is_owner = django_filters.BooleanFilter(
        field_name="is_owner"
    )

    is_staff = django_filters.BooleanFilter(
        field_name="is_staff"
    )

    is_superuser = django_filters.BooleanFilter(
        field_name="is_superuser"
    )

    # =========================
    # Agency
    # =========================

    agency = django_filters.NumberFilter(
        field_name="agency_id"
    )

    # =========================
    # Service Neighborhood
    # =========================

    service_neighborhood = django_filters.NumberFilter(
        field_name="service_neighborhoods__id"
    )

    # =========================
    # Permission
    # =========================

    has_permission = django_filters.CharFilter(
        method="filter_has_permission"
    )

    def filter_has_permission(
        self,
        queryset,
        name,
        value
    ):
        return queryset.filter(
            Q(role__permissions__codename=value)
            |
            Q(user_permissions__codename=value)
        ).distinct()

    # =========================
    # Created date
    # =========================

    created_from = django_filters.DateTimeFilter(
        field_name="created_at",
        lookup_expr="gte"
    )

    created_to = django_filters.DateTimeFilter(
        field_name="created_at",
        lookup_expr="lte"
    )

    # =========================
    # Last login
    # =========================

    login_from = django_filters.DateTimeFilter(
        field_name="last_login",
        lookup_expr="gte"
    )

    login_to = django_filters.DateTimeFilter(
        field_name="last_login",
        lookup_expr="lte"
    )

    class Meta:

        model = User

        fields = [
            "role",
            "is_active",
            "is_owner",
            "is_staff",
            "is_superuser",
            "agency",
            "service_neighborhood",
            "has_permission",
        ]