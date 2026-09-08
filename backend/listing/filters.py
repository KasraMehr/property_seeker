import django_filters
from django.db.models import Q

from .models import Listing


class ListingFilter(django_filters.FilterSet):

    # =========================================================
    # Basic filters
    # =========================================================

    status = django_filters.MultipleChoiceFilter(
        field_name="status",
        choices=Listing.Status.choices,
    )

    advertiser_type = django_filters.MultipleChoiceFilter(
        field_name="advertiser_type",
        choices=Listing.AdvertiserType.choices,
    )

    advertiser_classification_status = django_filters.MultipleChoiceFilter(
        field_name="advertiser_classification_status",
        choices=Listing.AdvertiserClassificationStatus.choices,
    )

    review_status = django_filters.MultipleChoiceFilter(
        field_name="review_status",
        choices=Listing.ReviewStatus.choices,
    )

    category = django_filters.MultipleChoiceFilter(
        field_name="category",
        choices=Listing.Category.choices,
    )

    source = django_filters.NumberFilter(
        field_name="source_id",
    )

    property = django_filters.NumberFilter(
        field_name="property_id",
    )

    # =========================================================
    # Location
    # =========================================================

    zone = django_filters.CharFilter(
        field_name="divar_neighborhood__zone_id",
    )

    divar_neighborhood = django_filters.NumberFilter(
        field_name="divar_neighborhood_id",
    )

    # =========================================================
    # Text search
    # =========================================================

    search = django_filters.CharFilter(
        method="filter_search",
    )

    # =========================================================
    # Sale price
    # =========================================================

    listed_sale_price_min = django_filters.NumberFilter(
        field_name="listed_sale_price",
        lookup_expr="gte",
    )

    listed_sale_price_max = django_filters.NumberFilter(
        field_name="listed_sale_price",
        lookup_expr="lte",
    )

    # =========================================================
    # Price per meter
    # =========================================================

    listed_price_per_meter_min = django_filters.NumberFilter(
        field_name="listed_price_per_meter",
        lookup_expr="gte",
    )

    listed_price_per_meter_max = django_filters.NumberFilter(
        field_name="listed_price_per_meter",
        lookup_expr="lte",
    )

    # =========================================================
    # Mortgage
    # =========================================================

    listed_mortgage_amount_min = django_filters.NumberFilter(
        field_name="listed_mortgage_amount",
        lookup_expr="gte",
    )

    listed_mortgage_amount_max = django_filters.NumberFilter(
        field_name="listed_mortgage_amount",
        lookup_expr="lte",
    )

    # =========================================================
    # Deposit
    # =========================================================

    listed_deposit_amount_min = django_filters.NumberFilter(
        field_name="listed_deposit_amount",
        lookup_expr="gte",
    )

    listed_deposit_amount_max = django_filters.NumberFilter(
        field_name="listed_deposit_amount",
        lookup_expr="lte",
    )

    # =========================================================
    # Rent
    # =========================================================

    listed_rent_amount_min = django_filters.NumberFilter(
        field_name="listed_rent_amount",
        lookup_expr="gte",
    )

    listed_rent_amount_max = django_filters.NumberFilter(
        field_name="listed_rent_amount",
        lookup_expr="lte",
    )

    # =========================================================
    # Property specifications
    # =========================================================

    listed_area_min = django_filters.NumberFilter(
        field_name="listed_area",
        lookup_expr="gte",
    )

    listed_area_max = django_filters.NumberFilter(
        field_name="listed_area",
        lookup_expr="lte",
    )

    build_year_min = django_filters.NumberFilter(
        field_name="build_year",
        lookup_expr="gte",
    )

    build_year_max = django_filters.NumberFilter(
        field_name="build_year",
        lookup_expr="lte",
    )

    room_count = django_filters.NumberFilter(
        field_name="room_count",
    )

    floor_number = django_filters.NumberFilter(
        field_name="floor_number",
    )

    floor_number_min = django_filters.NumberFilter(
        field_name="floor_number",
        lookup_expr="gte",
    )

    floor_number_max = django_filters.NumberFilter(
        field_name="floor_number",
        lookup_expr="lte",
    )

    total_floors = django_filters.NumberFilter(
        field_name="total_floors",
    )

    # =========================================================
    # Media / engagement
    # =========================================================

    media_count_min = django_filters.NumberFilter(
        field_name="media_count",
        lookup_expr="gte",
    )

    media_count_max = django_filters.NumberFilter(
        field_name="media_count",
        lookup_expr="lte",
    )

    views_count_min = django_filters.NumberFilter(
        field_name="views_count",
        lookup_expr="gte",
    )

    views_count_max = django_filters.NumberFilter(
        field_name="views_count",
        lookup_expr="lte",
    )

    leads_count_min = django_filters.NumberFilter(
        field_name="leads_count",
        lookup_expr="gte",
    )

    leads_count_max = django_filters.NumberFilter(
        field_name="leads_count",
        lookup_expr="lte",
    )

    # =========================================================
    # Boolean filters
    # =========================================================

    pictures_match_property = django_filters.BooleanFilter(
        field_name="pictures_match_property",
    )

    removal_detected = django_filters.BooleanFilter(
        method="filter_removal_detected",
    )

    # =========================================================
    # Scraper health
    # =========================================================

    consecutive_failures_min = django_filters.NumberFilter(
        field_name="consecutive_failures",
        lookup_expr="gte",
    )

    consecutive_failures_max = django_filters.NumberFilter(
        field_name="consecutive_failures",
        lookup_expr="lte",
    )

    # =========================================================
    # Dates
    # =========================================================

    first_seen_from = django_filters.IsoDateTimeFilter(
        field_name="first_seen_at",
        lookup_expr="gte",
    )

    first_seen_to = django_filters.IsoDateTimeFilter(
        field_name="first_seen_at",
        lookup_expr="lte",
    )

    last_seen_from = django_filters.IsoDateTimeFilter(
        field_name="last_seen_at",
        lookup_expr="gte",
    )

    last_seen_to = django_filters.IsoDateTimeFilter(
        field_name="last_seen_at",
        lookup_expr="lte",
    )

    last_changed_from = django_filters.IsoDateTimeFilter(
        field_name="last_changed_at",
        lookup_expr="gte",
    )

    last_changed_to = django_filters.IsoDateTimeFilter(
        field_name="last_changed_at",
        lookup_expr="lte",
    )

    last_checked_from = django_filters.IsoDateTimeFilter(
        field_name="last_checked_at",
        lookup_expr="gte",
    )

    last_checked_to = django_filters.IsoDateTimeFilter(
        field_name="last_checked_at",
        lookup_expr="lte",
    )

    created_from = django_filters.IsoDateTimeFilter(
        field_name="created_at",
        lookup_expr="gte",
    )

    created_to = django_filters.IsoDateTimeFilter(
        field_name="created_at",
        lookup_expr="lte",
    )

    # =========================================================
    # Published at (used by frontend daily time-range presets)
    # =========================================================

    published_at_from = django_filters.IsoDateTimeFilter(
        field_name="published_at",
        lookup_expr="gte",
    )

    published_at_to = django_filters.IsoDateTimeFilter(
        field_name="published_at",
        lookup_expr="lte",
    )

    # =========================================================
    # Freshness (server-side, replaces client-side filtering)
    # "new" = both published_at AND created_at within 24h
    # "updated" = last_changed_at within 24h but NOT new
    # =========================================================

    freshness = django_filters.CharFilter(
        method="filter_freshness",
    )

    # =========================================================
    # Custom filters
    # =========================================================

    def filter_search(self, queryset, name, value):
        if not value:
            return queryset

        search_query = (
                Q(title__icontains=value)
                | Q(description__icontains=value)
                | Q(external_id__icontains=value)
                | Q(contact_phone__icontains=value)
        )

        if value.isdigit():
            search_query |= Q(id=int(value))

        return queryset.filter(search_query)

    def filter_removal_detected(self, queryset, name, value):
        if value is True:
            return queryset.filter(
                removal_detected_at__isnull=False
            )

        if value is False:
            return queryset.filter(
                removal_detected_at__isnull=True
            )

        return queryset

    def filter_freshness(self, queryset, name, value):
        """
        Server-side freshness filter.
        "new": listing created AND published within last 24 hours.
        "updated": last_changed_at within 24 hours but NOT new.
        "all" or empty: no filter.
        """
        from datetime import timedelta
        from django.utils import timezone

        if not value or value == "all":
            return queryset

        threshold = timezone.now() - timedelta(hours=24)

        if value == "new":
            return queryset.filter(
                published_at__gte=threshold,
                created_at__gte=threshold,
            )

        if value == "updated":
            return queryset.filter(
                last_changed_at__gte=threshold,
            ).exclude(
                published_at__gte=threshold,
                created_at__gte=threshold,
            )

        return queryset

    # ── Preset time-range helpers (OR across first_seen_at / last_changed_at) ──
    # These filters are not backed by model fields, so django-filters' form
    # won't include them in cleaned_data.  We override filter_queryset to
    # parse them directly from request data.

    _PRESET_TIME_FIELDS = {
        "time_from": ("first_seen_at", "last_changed_at", "gte"),
        "time_to":   ("first_seen_at", "last_changed_at", "lte"),
    }

    def filter_queryset(self, queryset):
        qs = super().filter_queryset(queryset)

        # Apply preset time-range filters that live outside Meta.fields
        for key, (field_a, field_b, lookup) in self._PRESET_TIME_FIELDS.items():
            raw = self.data.get(key)
            if not raw:
                continue
            try:
                value = self.form.fields[key].to_python(raw)
            except Exception:
                # Fall back: let the IsoDateTimeField of the first matching
                # filter handle parsing if the form doesn't have the field.
                from django_filters.fields import IsoDateTimeField
                value = IsoDateTimeField().to_python(raw)
            if value is None:
                continue
            qs = qs.filter(
                Q(**{f"{field_a}__{lookup}": value})
                | Q(**{f"{field_b}__{lookup}": value})
            )
        return qs

    def filter_time_from(self, queryset, name, value):
        """
        OR filter: listing was first seen OR last changed on/after *value*.
        Handles NULL last_changed_at correctly.
        """
        return queryset.filter(
            Q(first_seen_at__gte=value) | Q(last_changed_at__gte=value)
        )

    def filter_time_to(self, queryset, name, value):
        """
        OR filter: listing was first seen OR last changed on/before *value*.
        Handles NULL last_changed_at correctly.
        """
        return queryset.filter(
            Q(first_seen_at__lte=value) | Q(last_changed_at__lte=value)
        )

    class Meta:
        model = Listing

        fields = [
            # Basic
            "status",
            "advertiser_type",
            "advertiser_classification_status",
            "review_status",
            "category",
            "source",
            "property",

            # Location
            "zone",
            "divar_neighborhood",

            # Search
            "search",

            # Prices
            "listed_sale_price_min",
            "listed_sale_price_max",
            "listed_price_per_meter_min",
            "listed_price_per_meter_max",
            "listed_mortgage_amount_min",
            "listed_mortgage_amount_max",
            "listed_deposit_amount_min",
            "listed_deposit_amount_max",
            "listed_rent_amount_min",
            "listed_rent_amount_max",

            # Property
            "listed_area_min",
            "listed_area_max",
            "build_year_min",
            "build_year_max",
            "room_count",
            "floor_number",
            "floor_number_min",
            "floor_number_max",
            "total_floors",

            # Engagement
            "media_count_min",
            "media_count_max",
            "views_count_min",
            "views_count_max",
            "leads_count_min",
            "leads_count_max",

            # Boolean
            "pictures_match_property",
            "removal_detected",

            # Scraper
            "consecutive_failures_min",
            "consecutive_failures_max",

            # Dates — individual
            "first_seen_from",
            "first_seen_to",
            "last_seen_from",
            "last_seen_to",
            "last_changed_from",
            "last_changed_to",
            "last_checked_from",
            "last_checked_to",
            "created_from",
            "created_to",
            "published_at_from",
            "published_at_to",
            "freshness",
        ]