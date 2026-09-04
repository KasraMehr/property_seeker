from rest_framework import serializers

from listing.serializers.listing import ListingListSerializer
from ingestion.providers.divar.parser import normalize_iran_mobile
from locations.models import Zone

from ..models import IngestionRun, IngestionRunItem, ListingSnapshot, ScrapeTarget, TargetListing
from ..services.targets import normalize_divar_base_url


class DivarLoginStartSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)

    def validate_phone(self, value):
        normalized = normalize_iran_mobile(value)
        if not normalized:
            raise serializers.ValidationError("Enter a valid Iranian mobile number.")
        return normalized


class DivarLoginOtpSerializer(serializers.Serializer):
    otp = serializers.RegexField(
        regex=r"^\d{4,8}$",
        error_messages={"invalid": "OTP must contain 4 to 8 digits."},
    )
from listing.models import Source

class ScrapeTargetSerializer(serializers.ModelSerializer):
    source = serializers.PrimaryKeyRelatedField(queryset=Source.objects.all())
    source_detail = serializers.SerializerMethodField(read_only=True)
    zone_detail = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = ScrapeTarget
        fields = (
            "id", "name", "source", "source_detail", "base_url", "search_url",
            "listing_category", "zone", "zone_detail", "enabled",
            "discovery_interval_minutes", "incremental_known_streak",
            "incremental_max_cards", "last_watermark_external_id",
            "last_discovery_at", "last_full_discovery_at",
            "created_at", "updated_at",
        )
        read_only_fields = (
            "id", "last_watermark_external_id", "last_discovery_at",
            "last_full_discovery_at", "created_at", "updated_at", "source_detail",
            "zone_detail",
        )
        extra_kwargs = {"search_url": {"required": False}}

    def get_source_detail(self, obj):
        return {"id": obj.source_id, "name": obj.source.name}

    def get_zone_detail(self, obj):
        if not obj.zone_id:
            return None
        return {"id": obj.zone_id, "name": obj.zone.name, "city": obj.zone.city_id}

    def validate_source(self, value):
        if value.name.strip().lower() != "divar":
            raise serializers.ValidationError(
                "Only the Divar provider is supported in the current version."
            )
        return value

    def validate(self, attrs):
        if not self.instance and not attrs.get("search_url") and not attrs.get("base_url"):
            raise serializers.ValidationError(
                {"base_url": "A Divar base URL is required."}
            )
        if attrs.get("base_url"):
            try:
                attrs["base_url"], city_slug = normalize_divar_base_url(
                    attrs["base_url"]
                )
            except Exception as error:
                raise serializers.ValidationError({"base_url": str(error)}) from error
            zone = attrs.get("zone") or getattr(self.instance, "zone", None)
            if zone and zone.city.slug != city_slug:
                raise serializers.ValidationError(
                    {"zone": "The zone does not belong to the URL city."}
                )
        return attrs


class ScrapeTargetBundleCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    source = serializers.PrimaryKeyRelatedField(queryset=Source.objects.all())
    base_url = serializers.URLField(max_length=1000)
    zone = serializers.PrimaryKeyRelatedField(queryset=Zone.objects.filter(active=True))
    enabled = serializers.BooleanField(default=True)
    discovery_interval_minutes = serializers.IntegerField(min_value=5, default=15)
    incremental_known_streak = serializers.IntegerField(min_value=1, default=100)
    incremental_max_cards = serializers.IntegerField(min_value=1, default=500)

    def validate_source(self, value):
        if value.name.strip().lower() != "divar":
            raise serializers.ValidationError("Only Divar is supported.")
        return value

    def validate(self, attrs):
        try:
            normalized, city_slug = normalize_divar_base_url(attrs["base_url"])
        except Exception as error:
            raise serializers.ValidationError({"base_url": str(error)}) from error
        if attrs["zone"].city.slug != city_slug:
            raise serializers.ValidationError(
                {"zone": "The selected zone must belong to the URL city."}
            )
        attrs["base_url"] = normalized
        return attrs


class IngestionRunSerializer(serializers.ModelSerializer):
    target = serializers.SerializerMethodField()

    class Meta:
        model = IngestionRun
        fields = (
            "id", "target", "mode", "status", "configuration",
            "discovered_count", "queued_count", "processed_count",
            "new_count", "changed_count", "failed_count", "removed_count",
            "error_summary", "artifact_path", "started_at", "finished_at",
            "created_at",
        )

    def get_target(self, obj):
        return {"id": obj.target_id, "name": obj.target.name}


class IngestionRunItemSerializer(serializers.ModelSerializer):
    listing = ListingListSerializer(read_only=True)

    class Meta:
        model = IngestionRunItem
        fields = (
            "id", "run", "listing", "external_id", "url",
            "discovery_order", "card_fingerprint", "card_payload",
            "status", "retry_count", "created_listing", "changed",
            "error", "started_at", "finished_at",
        )


class ListingSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingSnapshot
        fields = (
            "id", "listing", "run", "content_hash",
            "payload", "changed_fields", "observed_at",
        )


class TargetListingSerializer(serializers.ModelSerializer):
    listing = ListingListSerializer(read_only=True)

    class Meta:
        model = TargetListing
        fields = (
            "id", "target", "listing", "first_seen_at", "last_seen_at",
            "last_seen_full_discovery_at", "consecutive_full_absences",
            "last_card_fingerprint",
        )
