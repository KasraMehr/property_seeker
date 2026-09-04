from rest_framework import serializers

from locations.models import DivarNeighborhood, Zone


class ZoneSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source="city.name", read_only=True)
    neighborhoods_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Zone
        fields = (
            "id",
            "name",
            "city",
            "city_name",
            "active",
            "neighborhoods_count",
        )


class DivarNeighborhoodSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source="city.name", read_only=True)
    city_slug = serializers.CharField(source="city.slug", read_only=True)
    zone_name = serializers.CharField(source="zone.name", read_only=True, allow_null=True)

    class Meta:
        model = DivarNeighborhood
        fields = (
            "id",
            "name",
            "normalized_name",
            "source",
            "city",
            "city_name",
            "city_slug",
            "zone",
            "zone_name",
            "active",
            "last_seen_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "name",
            "normalized_name",
            "source",
            "city",
            "city_name",
            "city_slug",
            "zone_name",
            "active",
            "last_seen_at",
            "created_at",
            "updated_at",
        )

    def validate_zone(self, zone):
        if zone is not None and self.instance and zone.city_id != self.instance.city_id:
            raise serializers.ValidationError(
                "The selected zone must belong to the neighborhood city."
            )
        return zone
