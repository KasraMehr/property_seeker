from rest_framework import serializers

from listing.models import Listing, Source


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = (
            "id",
            "name",
            "description",
        )


class ListingListSerializer(serializers.ModelSerializer):
    source = SourceSerializer(read_only=True)

    class Meta:
        model = Listing

        fields = (
            "id",
            "source",
            "external_id",
            "url",
            "status",
            "review_status",
            "title",
            "listed_sale_price",
            "listed_rent_amount",
            "listed_area",
            "room_count",
            "floor_number",
            "published_at",
            "first_seen_at",
            "last_seen_at",
        )


class ListingDetailSerializer(serializers.ModelSerializer):

    source = SourceSerializer(read_only=True)

    class Meta:
        model = Listing

        fields = (
            "id",

            "source",

            "external_id",
            "url",

            "status",
            "review_status",

            "title",
            "description",

            "listed_sale_price",
            "listed_price_per_meter",

            "listed_mortgage_amount",
            "listed_deposit_amount",
            "listed_rent_amount",

            "listed_area",

            "build_year",

            "room_count",

            "floor_number",
            "total_floors",

            "pictures_match_property",

            "media_count",

            "views_count",
            "leads_count",

            "published_at",
            "source_updated_at",
            "expires_at",

            "first_seen_at",
            "last_seen_at",

            "last_checked_at",
            "last_changed_at",

            "consecutive_failures",

            "removal_detected_at",

            "latest_payload",

            "created_at",
            "updated_at",
        )


from rest_framework import serializers

from listing.models import ListingStatusHistory


class ListingStatusHistorySerializer(serializers.ModelSerializer):

    listing_title = serializers.CharField(
        source="listing.title",
        read_only=True
    )

    changed_by_username = serializers.CharField(
        source="changed_by.full_name",
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = ListingStatusHistory

        fields = (
            "id",

            "listing",
            "listing_title",

            "old_status",
            "new_status",

            "reason",

            "changed_by",
            "changed_by_username",

            "created_at",
        )