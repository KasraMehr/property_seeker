import django_filters
from django.db.models import Q

from .models import IngestionRun, ScrapeTarget


class ScrapeTargetFilter(django_filters.FilterSet):
    """Server-side filters for ingestion.ScrapeTarget.

    Frontend TargetsTab sends:
      - search (name / search_url / zone name)
      - enabled (multi: ?enabled=true,false)
      - zone (multi: zone ids)
      - listing_category (multi)
    """

    search = django_filters.CharFilter(method="filter_search")
    enabled = django_filters.CharFilter(method="filter_enabled")
    zone = django_filters.BaseInFilter(field_name="zone_id")
    listing_category = django_filters.BaseInFilter(field_name="listing_category")

    class Meta:
        model = ScrapeTarget
        fields = ("search", "enabled", "zone", "listing_category")

    def filter_search(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(
            Q(name__icontains=value)
            | Q(search_url__icontains=value)
            | Q(zone__name__icontains=value)
        )

    def filter_enabled(self, queryset, name, value):
        mapping = {"true": True, "1": True, "false": False, "0": False}
        bools = [
            mapping[v.strip().lower()] for v in value.split(",") if v.strip().lower() in mapping
        ]
        if not bools:
            return queryset
        return queryset.filter(enabled__in=bools)


class IngestionRunFilter(django_filters.FilterSet):
    """Server-side filters for ingestion.IngestionRun.

    Frontend RunsTab sends:
      - search (target name / zone name)
      - status (multi)
      - mode (multi)
    """

    search = django_filters.CharFilter(method="filter_search")
    status = django_filters.BaseInFilter(field_name="status")
    mode = django_filters.BaseInFilter(field_name="mode")

    class Meta:
        model = IngestionRun
        fields = ("search", "status", "mode")

    def filter_search(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(
            Q(target__name__icontains=value)
            | Q(target__zone__name__icontains=value)
        )
