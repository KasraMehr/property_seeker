from rest_framework import serializers

from listing.serializers.listing import ListingListSerializer
from ..models import IngestionRun, IngestionRunItem, ListingSnapshot, ScrapeTarget, TargetListing
from listing.models import Source

class ScrapeTargetSerializer(serializers.ModelSerializer):
    source = serializers.PrimaryKeyRelatedField(queryset=Source.objects.all())
    source_detail = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = ScrapeTarget
        fields = (
            "id", "name", "source", "source_detail", "search_url", "enabled",
            "discovery_interval_minutes", "incremental_known_streak",
            "incremental_max_cards", "last_watermark_external_id",
            "last_discovery_at", "last_full_discovery_at",
            "created_at", "updated_at",
        )
        read_only_fields = (
            "id", "last_watermark_external_id", "last_discovery_at",
            "last_full_discovery_at", "created_at", "updated_at", "source_detail",
        )

    def get_source_detail(self, obj):
        return {"id": obj.source_id, "name": obj.source.name}

    def validate_source(self, value):
        if value.name.strip().lower() != "divar":
            raise serializers.ValidationError(
                "Only the Divar provider is supported in the current version."
            )
        return value


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
