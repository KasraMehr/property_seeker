import django_filters
from django.db.models import Q

from properties.models import Property


class CharInFilter(
    django_filters.BaseInFilter,
    django_filters.CharFilter,
):
    pass


class PropertyFilter(django_filters.FilterSet):

    # =====================================================
    # Search
    # =====================================================

    search = django_filters.CharFilter(method="filter_search")

    # =====================================================
    # Quick Filters
    # =====================================================

    deal_type = CharInFilter(
        field_name="deal_type",
        lookup_expr="in",
    )

    status = CharInFilter(
        field_name="status",
        lookup_expr="in",
    )

    # =====================================================
    # Price
    # =====================================================

    price_min = django_filters.NumberFilter(method="filter_price_min")

    price_max = django_filters.NumberFilter(method="filter_price_max")

    # =====================================================
    # Area
    # =====================================================

    area_min = django_filters.NumberFilter(
        field_name="area",
        lookup_expr="gte",
    )

    area_max = django_filters.NumberFilter(
        field_name="area",
        lookup_expr="lte",
    )

    # =====================================================
    # Bedrooms
    # =====================================================

    bedrooms_min = django_filters.NumberFilter(
        field_name="bedrooms",
        lookup_expr="gte",
    )

    bedrooms_max = django_filters.NumberFilter(
        field_name="bedrooms",
        lookup_expr="lte",
    )

    # =====================================================
    # Property Type
    # =====================================================

    property_type = CharInFilter(
        field_name="property_type",
        lookup_expr="in",
    )

    # =====================================================
    # Owner
    # =====================================================

    owner = django_filters.NumberFilter(field_name="owner_id")

    # =====================================================
    # Agent
    # =====================================================

    agent = django_filters.NumberFilter(field_name="agent_id")

    # =====================================================
    # Location
    # =====================================================

    province = django_filters.NumberFilter(method="filter_province")

    city = django_filters.NumberFilter(method="filter_city")

    district = django_filters.NumberFilter(method="filter_district")

    neighborhood = django_filters.NumberFilter(method="filter_neighborhood")

    # =====================================================
    # Physical
    # =====================================================

    age_min = django_filters.NumberFilter(
        field_name="age",
        lookup_expr="gte",
    )

    age_max = django_filters.NumberFilter(
        field_name="age",
        lookup_expr="lte",
    )

    floor_min = django_filters.NumberFilter(
        field_name="floor",
        lookup_expr="gte",
    )

    floor_max = django_filters.NumberFilter(
        field_name="floor",
        lookup_expr="lte",
    )

    total_floors_min = django_filters.NumberFilter(
        field_name="total_floors",
        lookup_expr="gte",
    )

    total_floors_max = django_filters.NumberFilter(
        field_name="total_floors",
        lookup_expr="lte",
    )

    bathrooms_min = django_filters.NumberFilter(
        field_name="bathrooms",
        lookup_expr="gte",
    )

    bathrooms_max = django_filters.NumberFilter(
        field_name="bathrooms",
        lookup_expr="lte",
    )

    parking_min = django_filters.NumberFilter(
        field_name="parking_count",
        lookup_expr="gte",
    )

    parking_max = django_filters.NumberFilter(
        field_name="parking_count",
        lookup_expr="lte",
    )

    storage_min = django_filters.NumberFilter(
        field_name="storage_count",
        lookup_expr="gte",
    )

    storage_max = django_filters.NumberFilter(
        field_name="storage_count",
        lookup_expr="lte",
    )

    # =====================================================
    # Orientation
    # =====================================================

    orientation = CharInFilter(
        field_name="orientation",
        lookup_expr="in",
    )

    # =====================================================
    # Condition
    # =====================================================

    condition = CharInFilter(
        field_name="condition",
        lookup_expr="in",
    )

    # =====================================================
    # Price Per Meter
    # =====================================================

    ppm_min = django_filters.NumberFilter(
        field_name="price_per_meter",
        lookup_expr="gte",
    )

    ppm_max = django_filters.NumberFilter(
        field_name="price_per_meter",
        lookup_expr="lte",
    )

    # =====================================================
    # Mortgage
    # =====================================================

    mortgage_min = django_filters.NumberFilter(
        field_name="mortgage_amount",
        lookup_expr="gte",
    )

    mortgage_max = django_filters.NumberFilter(
        field_name="mortgage_amount",
        lookup_expr="lte",
    )

    # =====================================================
    # Deposit
    # =====================================================

    deposit_min = django_filters.NumberFilter(
        field_name="deposit_amount",
        lookup_expr="gte",
    )

    deposit_max = django_filters.NumberFilter(
        field_name="deposit_amount",
        lookup_expr="lte",
    )

    # =====================================================
    # Monthly Rent
    # =====================================================

    rent_min = django_filters.NumberFilter(
        field_name="monthly_rent",
        lookup_expr="gte",
    )

    rent_max = django_filters.NumberFilter(
        field_name="monthly_rent",
        lookup_expr="lte",
    )

    # =====================================================
    # Has Owner
    # =====================================================

    has_owner = django_filters.BooleanFilter(method="filter_has_owner")

    # =====================================================
    # Has Agent
    # =====================================================

    has_agent = django_filters.BooleanFilter(method="filter_has_agent")

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
    # Updated At
    # =====================================================

    updated_from = django_filters.IsoDateTimeFilter(
        field_name="updated_at",
        lookup_expr="gte",
    )

    updated_to = django_filters.IsoDateTimeFilter(
        field_name="updated_at",
        lookup_expr="lte",
    )

    # =====================================================
    # SEARCH
    # =====================================================

    def filter_search(
        self,
        queryset,
        name,
        value,
    ):

        if not value:
            return queryset

        return queryset.filter(
            Q(title__icontains=value)
            | Q(property_code__icontains=value)
            | Q(description__icontains=value)
            | Q(address__full_text__icontains=value)
        ).distinct()

    # =====================================================
    # PRICE MIN
    # =====================================================

    def filter_price_min(
        self,
        queryset,
        name,
        value,
    ):

        if value is None:
            return queryset

        return queryset.filter(
            Q(sale_price__gte=value)
            | Q(monthly_rent__gte=value)
            | Q(mortgage_amount__gte=value)
            | Q(deposit_amount__gte=value)
        )

    # =====================================================
    # PRICE MAX
    # =====================================================

    def filter_price_max(
        self,
        queryset,
        name,
        value,
    ):

        if value is None:
            return queryset

        return queryset.filter(
            Q(sale_price__lte=value)
            | Q(monthly_rent__lte=value)
            | Q(mortgage_amount__lte=value)
            | Q(deposit_amount__lte=value)
        )

    # =====================================================
    # PROVINCE
    # =====================================================

    def filter_province(
        self,
        queryset,
        name,
        value,
    ):

        if value is None:
            return queryset

        return queryset.filter(address__neighborhood__district__city__province_id=value)

    # =====================================================
    # CITY
    # =====================================================

    def filter_city(
        self,
        queryset,
        name,
        value,
    ):

        if value is None:
            return queryset

        return queryset.filter(address__neighborhood__district__city_id=value)

    # =====================================================
    # DISTRICT
    # =====================================================

    def filter_district(
        self,
        queryset,
        name,
        value,
    ):

        if value is None:
            return queryset

        return queryset.filter(address__neighborhood__district_id=value)

    # =====================================================
    # NEIGHBORHOOD
    # =====================================================

    def filter_neighborhood(
        self,
        queryset,
        name,
        value,
    ):

        if value is None:
            return queryset

        return queryset.filter(address__neighborhood_id=value)

    # =====================================================
    # HAS OWNER
    # =====================================================

    def filter_has_owner(
        self,
        queryset,
        name,
        value,
    ):

        if value is None:
            return queryset

        if value:
            return queryset.filter(owner__isnull=False)

        return queryset.filter(owner__isnull=True)

    # =====================================================
    # HAS AGENT
    # =====================================================

    def filter_has_agent(
        self,
        queryset,
        name,
        value,
    ):

        if value is None:
            return queryset

        if value:
            return queryset.filter(agent__isnull=False)

        return queryset.filter(agent__isnull=True)

    class Meta:

        model = Property

        fields = [
            "search",
            "deal_type",
            "status",
            "price_min",
            "price_max",
            "area_min",
            "area_max",
            "bedrooms_min",
            "bedrooms_max",
            "property_type",
            "owner",
            "agent",
            "province",
            "city",
            "district",
            "neighborhood",
            "age_min",
            "age_max",
            "floor_min",
            "floor_max",
            "total_floors_min",
            "total_floors_max",
            "bathrooms_min",
            "bathrooms_max",
            "parking_min",
            "parking_max",
            "storage_min",
            "storage_max",
            "orientation",
            "condition",
            "ppm_min",
            "ppm_max",
            "mortgage_min",
            "mortgage_max",
            "deposit_min",
            "deposit_max",
            "rent_min",
            "rent_max",
            "has_owner",
            "has_agent",
            "created_from",
            "created_to",
            "updated_from",
            "updated_to",
        ]
