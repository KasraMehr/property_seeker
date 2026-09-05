import django_filters
from django.db.models import Q

from accounts.models import User


class UserFilter(django_filters.FilterSet):

    # =========================
    # Search
    # =========================

    search = django_filters.CharFilter(method="filter_search")

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

    is_active = django_filters.BooleanFilter(field_name="is_active")

    is_owner = django_filters.BooleanFilter(field_name="is_owner")

    is_staff = django_filters.BooleanFilter(field_name="is_staff")

    is_superuser = django_filters.BooleanFilter(field_name="is_superuser")

    # =========================
    # Agency
    # =========================

    agency = django_filters.NumberFilter(field_name="agency_id")

    # =========================
    # Service Neighborhood
    # =========================

    service_neighborhood = django_filters.NumberFilter(
        field_name="service_neighborhoods__id"
    )

    # =========================
    # Permission
    # =========================

    has_permission = django_filters.CharFilter(method="filter_has_permission")

    def filter_has_permission(self, queryset, name, value):
        return queryset.filter(
            Q(role__permissions__codename=value) | Q(user_permissions__codename=value)
        ).distinct()

    # =========================
    # Created date
    # =========================

    created_from = django_filters.DateTimeFilter(
        field_name="created_at", lookup_expr="gte"
    )

    created_to = django_filters.DateTimeFilter(
        field_name="created_at", lookup_expr="lte"
    )

    # =========================
    # Last login
    # =========================

    login_from = django_filters.DateTimeFilter(
        field_name="last_login", lookup_expr="gte"
    )

    login_to = django_filters.DateTimeFilter(field_name="last_login", lookup_expr="lte")

    # =========================
    # Methods
    # =========================

    def filter_search(self, queryset, name, value):
        if not value:
            return queryset

        return queryset.filter(
            Q(full_name__icontains=value)
            | Q(phone__icontains=value)
            | Q(national_id__icontains=value)
        ).distinct()

    class Meta:

        model = User

        fields = [
            "search",
            "role",
            "is_active",
            "is_owner",
            "is_staff",
            "is_superuser",
            "agency",
            "service_neighborhood",
            "has_permission",
            "created_from",
            "created_to",
            "login_from",
            "login_to",
        ]
