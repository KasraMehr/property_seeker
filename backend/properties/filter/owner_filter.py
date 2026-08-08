import django_filters

from properties.models import Owner


class OwnerFilter(django_filters.FilterSet):

    # ─────────────────────────────
    # Created By
    # ─────────────────────────────

    created_by = django_filters.NumberFilter(
        field_name="created_by_id"
    )

    # ─────────────────────────────
    # Has Alternate Phone
    # ─────────────────────────────

    has_alternate_phone = django_filters.BooleanFilter(
        method="filter_has_alternate_phone"
    )

    def filter_has_alternate_phone(
        self,
        queryset,
        name,
        value#از queryset میگیریم.
    ):
        if value is None:
            return queryset

        if value:
            return queryset.exclude(
                alternate_phone__isnull=True
            ).exclude(
                alternate_phone=""
            )

        return queryset.filter(
            alternate_phone=""
        ) | queryset.filter(
            alternate_phone__isnull=True
        )

    # ─────────────────────────────
    # Has National ID
    # ─────────────────────────────

    has_national_id = django_filters.BooleanFilter(
        method="filter_has_national_id"
    )

    def filter_has_national_id(
        self,
        queryset,
        name,
        value
    ):
        if value is None:
            return queryset

        if value:
            return queryset.exclude(
                national_id__isnull=True
            ).exclude(
                national_id=""
            )

        return queryset.filter(
            national_id=""
        ) | queryset.filter(
            national_id__isnull=True
        )

    # ─────────────────────────────
    # Has Notes
    # ─────────────────────────────

    has_notes = django_filters.BooleanFilter(
        method="filter_has_notes"
    )

    def filter_has_notes(
        self,
        queryset,
        name,
        value
    ):
        if value is None:
            return queryset

        if value:
            return queryset.exclude(
                notes__isnull=True
            ).exclude(
                notes=""
            )

        return queryset.filter(
            notes=""
        ) | queryset.filter(
            notes__isnull=True
        )

    # ─────────────────────────────
    # Created At
    # ─────────────────────────────

    created_from = django_filters.IsoDateTimeFilter(
        field_name="created_at",
        lookup_expr="gte"
    )

    created_to = django_filters.IsoDateTimeFilter(
        field_name="created_at",
        lookup_expr="lte"
    )

    # ─────────────────────────────
    # Updated At
    # ─────────────────────────────

    updated_from = django_filters.IsoDateTimeFilter(
        field_name="updated_at",
        lookup_expr="gte"
    )

    updated_to = django_filters.IsoDateTimeFilter(
        field_name="updated_at",
        lookup_expr="lte"
    )

    class Meta:
        model = Owner

        fields = [
            "created_by",
            "has_alternate_phone",
            "has_national_id",
            "has_notes",
            "created_from",
            "created_to",
            "updated_from",
            "updated_to",
        ]