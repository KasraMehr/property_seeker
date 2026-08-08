import django_filters
from django.db.models import Q

from crm.models import CallLog


class CharInFilter(
    django_filters.BaseInFilter,
    django_filters.CharFilter
):
    pass


class CallLogFilter(django_filters.FilterSet):

    # =========================
    # Search
    # =========================

    search = django_filters.CharFilter(
        method="filter_search"
    )

    # =========================
    # Quick filters
    # =========================

    call_type = CharInFilter(
        field_name="call_type",
        lookup_expr="in",
    )

    result = CharInFilter(
        field_name="result",
        lookup_expr="in",
    )

    handled_by = django_filters.NumberFilter(
        field_name="handled_by_id"
    )

    # =========================
    # Call date
    # =========================

    called_from = django_filters.IsoDateTimeFilter(
        field_name="called_at",
        lookup_expr="gte",
    )

    called_to = django_filters.IsoDateTimeFilter(
        field_name="called_at",
        lookup_expr="lte",
    )

    # =========================
    # Customer
    # =========================

    customer = django_filters.NumberFilter(
        field_name="customer_id"
    )

    customer_type = CharInFilter(
        field_name="customer__customer_type",
        lookup_expr="in",
    )

    # =========================
    # Property
    # =========================

    property = django_filters.NumberFilter(
        field_name="property_id"
    )

    # =========================
    # Listing
    # =========================

    listing = django_filters.NumberFilter(
        field_name="listing_id"
    )

    # =========================
    # Follow up
    # =========================

    has_follow_up = django_filters.BooleanFilter(
        method="filter_has_follow_up"
    )

    follow_up_done = django_filters.BooleanFilter(
        field_name="follow_up_done"
    )

    has_next_follow_up = django_filters.BooleanFilter(
        method="filter_has_next_follow_up"
    )

    # =========================
    # Duration
    # =========================

    duration_min = django_filters.NumberFilter(
        field_name="call_duration",
        lookup_expr="gte",
    )

    duration_max = django_filters.NumberFilter(
        field_name="call_duration",
        lookup_expr="lte",
    )

    # =========================
    # Record
    # =========================

    has_record = django_filters.BooleanFilter(
        method="filter_has_record"
    )

    # =========================
    # Deleted
    # =========================

    is_deleted = django_filters.BooleanFilter(
        field_name="is_deleted"
    )

    # =========================
    # Created date
    # =========================

    created_from = django_filters.IsoDateTimeFilter(
        field_name="created_at",
        lookup_expr="gte",
    )

    created_to = django_filters.IsoDateTimeFilter(
        field_name="created_at",
        lookup_expr="lte",
    )

    # =========================
    # Methods
    # =========================

    def filter_search(self, queryset, name, value):

        if not value:
            return queryset

        return queryset.filter(
            Q(customer__full_name__icontains=value)
            | Q(customer__phone__icontains=value)
            | Q(note__icontains=value)
        ).distinct()

    def filter_has_follow_up(
        self,
        queryset,
        name,
        value
    ):

        if value is None:
            return queryset

        if value:
            return queryset.filter(
                next_follow_up_at__isnull=False,
                follow_up_done=False,
            )

        return queryset.filter(
            Q(next_follow_up_at__isnull=True)
            | Q(follow_up_done=True)
        )

    def filter_has_next_follow_up(
        self,
        queryset,
        name,
        value
    ):

        if value is None:
            return queryset

        if value:
            return queryset.filter(
                next_follow_up_at__isnull=False
            )

        return queryset.filter(
            next_follow_up_at__isnull=True
        )

    def filter_has_record(
        self,
        queryset,
        name,
        value
    ):

        if value is None:
            return queryset

        if value:
            return queryset.filter(
                record_file__isnull=False
            ).exclude(
                record_file=""
            )

        return queryset.filter(
            Q(record_file__isnull=True)
            | Q(record_file="")
        )

    class Meta:
        model = CallLog

        fields = [
            "search",
            "call_type",
            "result",
            "handled_by",
            "called_from",
            "called_to",
            "customer",
            "customer_type",
            "property",
            "listing",
            "has_follow_up",
            "follow_up_done",
            "has_next_follow_up",
            "duration_min",
            "duration_max",
            "has_record",
            "is_deleted",
            "created_from",
            "created_to",
        ]