import django_filters
from django.db.models import Q
from django.utils import timezone

from crm.models import Reminder


class CharInFilter(django_filters.BaseInFilter, django_filters.CharFilter):
    """
    برای multi_select

    مثال:

    ?type=call,visit
    ?status=pending,done
    """


class ReminderFilter(django_filters.FilterSet):

    # =====================================================
    # Search
    # =====================================================

    search = django_filters.CharFilter(method="filter_search")

    # =====================================================
    # Quick Filters
    # =====================================================

    type = CharInFilter(
        field_name="type",
        lookup_expr="in",
    )

    status = CharInFilter(
        field_name="status",
        lookup_expr="in",
    )

    user = django_filters.NumberFilter(field_name="user_id")

    # =====================================================
    # Due Date
    # =====================================================

    due_from = django_filters.IsoDateTimeFilter(
        field_name="due_at",
        lookup_expr="gte",
    )

    due_to = django_filters.IsoDateTimeFilter(
        field_name="due_at",
        lookup_expr="lte",
    )

    # =====================================================
    # Customer
    # =====================================================

    customer = django_filters.NumberFilter(field_name="customer_id")

    # =====================================================
    # Property
    # =====================================================

    property = django_filters.NumberFilter(field_name="property_id")

    # =====================================================
    # Overdue
    # =====================================================

    overdue = django_filters.BooleanFilter(method="filter_overdue")

    # =====================================================
    # Due Today
    # =====================================================

    due_today = django_filters.BooleanFilter(method="filter_due_today")

    # =====================================================
    # Due This Week
    # =====================================================

    due_this_week = django_filters.BooleanFilter(method="filter_due_this_week")

    # =====================================================
    # Completed Today
    # =====================================================

    completed_today = django_filters.BooleanFilter(method="filter_completed_today")

    # =====================================================
    # Has Property
    # =====================================================

    has_property = django_filters.BooleanFilter(method="filter_has_property")

    # =====================================================
    # Has Customer
    # =====================================================

    has_customer = django_filters.BooleanFilter(method="filter_has_customer")

    # =====================================================
    # Agency
    # =====================================================

    agency = django_filters.NumberFilter(field_name="agency_id")

    # =====================================================
    # Created At
    # =====================================================

    created_from = django_filters.IsoDateTimeFilter(
        field_name="created_at",
        lookup_expr="gte",
    )

    created_to = django_filters.IsoDateTimeFilter(
        field_name="created_at",
        lookup_expr="lte",
    )

    # =====================================================
    # Completed At
    # =====================================================

    completed_from = django_filters.IsoDateTimeFilter(
        field_name="completed_at",
        lookup_expr="gte",
    )

    completed_to = django_filters.IsoDateTimeFilter(
        field_name="completed_at",
        lookup_expr="lte",
    )

    # =====================================================
    # Search Method
    # =====================================================

    def filter_search(self, queryset, name, value):

        if not value:
            return queryset

        return queryset.filter(
            Q(title__icontains=value) | Q(description__icontains=value)
        ).distinct()

    # =====================================================
    # Overdue
    # =====================================================

    def filter_overdue(self, queryset, name, value):

        if value is None:
            return queryset

        now = timezone.now()

        if value:

            return queryset.filter(
                status=Reminder.Status.PENDING,
                due_at__lt=now,
            )

        return queryset.filter(
            Q(
                status__in=[
                    Reminder.Status.DONE,
                    Reminder.Status.CANCELED,
                ]
            )
            | Q(
                status=Reminder.Status.PENDING,
                due_at__gte=now,
            )
        )

    # =====================================================
    # Due Today
    # =====================================================

    def filter_due_today(self, queryset, name, value):

        if value is None:
            return queryset

        now = timezone.localtime()

        start = now.replace(
            hour=0,
            minute=0,
            second=0,
            microsecond=0,
        )

        end = start + timezone.timedelta(days=1)

        if value:

            return queryset.filter(
                status=Reminder.Status.PENDING,
                due_at__gte=start,
                due_at__lt=end,
            )

        return queryset.exclude(
            status=Reminder.Status.PENDING,
            due_at__gte=start,
            due_at__lt=end,
        )

    # =====================================================
    # Due This Week
    # =====================================================

    def filter_due_this_week(self, queryset, name, value):

        if value is None:
            return queryset

        now = timezone.localtime()

        # Monday = 0
        start = (now - timezone.timedelta(days=now.weekday())).replace(
            hour=0,
            minute=0,
            second=0,
            microsecond=0,
        )

        end = start + timezone.timedelta(days=7)

        if value:

            return queryset.filter(
                status=Reminder.Status.PENDING,
                due_at__gte=start,
                due_at__lt=end,
            )

        return queryset.exclude(
            status=Reminder.Status.PENDING,
            due_at__gte=start,
            due_at__lt=end,
        )

    # =====================================================
    # Completed Today
    # =====================================================

    def filter_completed_today(self, queryset, name, value):

        if value is None:
            return queryset

        now = timezone.localtime()

        start = now.replace(
            hour=0,
            minute=0,
            second=0,
            microsecond=0,
        )

        end = start + timezone.timedelta(days=1)

        if value:

            return queryset.filter(
                status=Reminder.Status.DONE,
                completed_at__gte=start,
                completed_at__lt=end,
            )

        return queryset.exclude(
            status=Reminder.Status.DONE,
            completed_at__gte=start,
            completed_at__lt=end,
        )

    # =====================================================
    # Has Property
    # =====================================================

    def filter_has_property(self, queryset, name, value):

        if value is None:
            return queryset

        if value:

            return queryset.filter(property__isnull=False)

        return queryset.filter(property__isnull=True)

    # =====================================================
    # Has Customer
    # =====================================================

    def filter_has_customer(self, queryset, name, value):

        if value is None:
            return queryset

        if value:

            return queryset.filter(customer__isnull=False)

        return queryset.filter(customer__isnull=True)

    class Meta:

        model = Reminder

        fields = [
            "search",
            "type",
            "status",
            "user",
            "due_from",
            "due_to",
            "customer",
            "property",
            "overdue",
            "due_today",
            "due_this_week",
            "completed_today",
            "has_property",
            "has_customer",
            "agency",
            "created_from",
            "created_to",
            "completed_from",
            "completed_to",
        ]
