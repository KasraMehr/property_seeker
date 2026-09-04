import django_filters
from django.db.models import Q

from .models import Listing


class ListingFilter(django_filters.FilterSet):
    # -------------------------
    # Basic filters
    # -------------------------

    status = django_filters.MultipleChoiceFilter(
        field_name="status",
        choices=Listing.Status.choices,
    )
    advertiser_type = django_filters.MultipleChoiceFilter(
        field_name="advertiser_type",
        choices=Listing.AdvertiserType.choices,
    )
    review_status = django_filters.MultipleChoiceFilter(
        field_name="review_status",
        choices=Listing.ReviewStatus.choices,
    )
    category = django_filters.MultipleChoiceFilter(
        field_name="category",
        choices=Listing.Category.choices,
    )
    zone = django_filters.CharFilter(
        field_name="divar_neighborhood__zone_id",
    )
    divar_neighborhood = django_filters.NumberFilter(
        field_name="divar_neighborhood_id",
    )

    source = django_filters.NumberFilter(
        field_name="source_id",
    )

    property = django_filters.NumberFilter(
        field_name="property_id",
    )

    # -------------------------
    # Text search
    # -------------------------

    search = django_filters.CharFilter(
        method="filter_search",
    )

    # -------------------------
    # Sale price
    # -------------------------

    listed_sale_price_min = django_filters.NumberFilter(
        field_name="listed_sale_price",
        lookup_expr="gte",
    )

    listed_sale_price_max = django_filters.NumberFilter(
        field_name="listed_sale_price",
        lookup_expr="lte",
    )

    # -------------------------
    # Price per meter
    # -------------------------

    listed_price_per_meter_min = django_filters.NumberFilter(
        field_name="listed_price_per_meter",
        lookup_expr="gte",
    )

    listed_price_per_meter_max = django_filters.NumberFilter(
        field_name="listed_price_per_meter",
        lookup_expr="lte",
    )

    # -------------------------
    # Mortgage
    # -------------------------

    listed_mortgage_amount_min = django_filters.NumberFilter(
        field_name="listed_mortgage_amount",
        lookup_expr="gte",
    )

    listed_mortgage_amount_max = django_filters.NumberFilter(
        field_name="listed_mortgage_amount",
        lookup_expr="lte",
    )

    # -------------------------
    # Deposit
    # -------------------------

    listed_deposit_amount_min = django_filters.NumberFilter(
        field_name="listed_deposit_amount",
        lookup_expr="gte",
    )

    listed_deposit_amount_max = django_filters.NumberFilter(
        field_name="listed_deposit_amount",
        lookup_expr="lte",
    )

    # -------------------------
    # Rent
    # -------------------------

    listed_rent_amount_min = django_filters.NumberFilter(
        field_name="listed_rent_amount",
        lookup_expr="gte",
    )

    listed_rent_amount_max = django_filters.NumberFilter(
        field_name="listed_rent_amount",
        lookup_expr="lte",
    )

    # -------------------------
    # Property specifications
    # -------------------------

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

    # -------------------------
    # Media / engagement
    # -------------------------

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

    # -------------------------
    # Boolean filters
    # -------------------------

    pictures_match_property = django_filters.BooleanFilter(
        field_name="pictures_match_property",
    )

    removal_detected = django_filters.BooleanFilter(
        method="filter_removal_detected",
    )

    # -------------------------
    # Scraper health
    # -------------------------

    consecutive_failures_min = django_filters.NumberFilter(
        field_name="consecutive_failures",
        lookup_expr="gte",
    )

    consecutive_failures_max = django_filters.NumberFilter(
        field_name="consecutive_failures",
        lookup_expr="lte",
    )

    # -------------------------
    # Dates
    # -------------------------

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

    # -------------------------
    # Custom methods
    # -------------------------

    def filter_search(self, queryset, name, value):
        if not value:
            return queryset

        return queryset.filter(
            Q(title__icontains=value)
            | Q(description__icontains=value)
            | Q(external_id__icontains=value)
        )

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

    class Meta:
        model = Listing
        fields = [
            "status",
            "review_status",
            "category",
            "zone",
            "divar_neighborhood",
            "source",
            "property",
            "search",
            "advertiser_type",
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
            "listed_area_min",
            "listed_area_max",
            "build_year_min",
            "build_year_max",
            "room_count",
            "floor_number",
            "floor_number_min",
            "floor_number_max",
            "total_floors",
            "media_count_min",
            "media_count_max",
            "views_count_min",
            "views_count_max",
            "leads_count_min",
            "leads_count_max",
            "pictures_match_property",
            "removal_detected",
            "consecutive_failures_min",
            "consecutive_failures_max",
            "first_seen_from",
            "first_seen_to",
            "last_seen_from",
            "last_seen_to",
            "last_checked_from",
            "last_checked_to",
            "created_from",
            "created_to",
        ]
