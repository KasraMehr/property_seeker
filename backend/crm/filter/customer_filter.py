import django_filters
from django.db.models import Q

from crm.models import Customer


class CharInFilter(
    django_filters.BaseInFilter,
    django_filters.CharFilter,
):
    """Multi-select via ?type=buyer,seller etc."""

    pass


class CustomerFilter(django_filters.FilterSet):
    """Server-side filters for crm.Customer.

    Frontend customerFilters.config.js expects:
      - search
      - customer_type (multi_select)
      - status (multi_select)

    Additional filters that the backend can reasonably support:
      - assigned_agent
      - source
      - is_deleted
      - created_from / created_to
      - updated_from / updated_to
    """

    # ── Search ──
    search = django_filters.CharFilter(method="filter_search")

    # ── Quick multi-selects ──
    customer_type = CharInFilter(field_name="customer_type", lookup_expr="in")
    status = CharInFilter(field_name="status", lookup_expr="in")

    # ── Foreign keys ──
    assigned_agent = django_filters.NumberFilter(field_name="assigned_agent_id")
    source = django_filters.CharFilter(field_name="source")

    # ── Flags ──
    is_deleted = django_filters.BooleanFilter(field_name="is_deleted")

    # ── Date ranges ──
    created_from = django_filters.IsoDateTimeFilter(
        field_name="created_at", lookup_expr="gte"
    )
    created_to = django_filters.IsoDateTimeFilter(
        field_name="created_at", lookup_expr="lte"
    )
    updated_from = django_filters.IsoDateTimeFilter(
        field_name="updated_at", lookup_expr="gte"
    )
    updated_to = django_filters.IsoDateTimeFilter(
        field_name="updated_at", lookup_expr="lte"
    )

    # ── Methods ──

    def filter_search(self, queryset, name, value):
        if not value:
            return queryset

        return queryset.filter(
            Q(full_name__icontains=value)
            | Q(phone__icontains=value)
            | Q(national_id__icontains=value)
            | Q(email__icontains=value)
            | Q(notes__icontains=value)
        ).distinct()

    class Meta:
        model = Customer
        fields = [
            "search",
            "customer_type",
            "status",
            "assigned_agent",
            "source",
            "is_deleted",
            "created_from",
            "created_to",
            "updated_from",
            "updated_to",
        ]
