from rest_framework import serializers

from listing.models import Listing, ListingStatusHistory, Source
from locations.models import Address
from properties.models import Owner, Property


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ("id", "name", "description")


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
            "advertiser_type",
            "advertiser_classification_status",
            "title",
            "contact_phone",
            "listed_sale_price",
            "listed_rent_amount",
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
            "advertiser_type",
            "advertiser_classification_status",
            "advertiser_classification_model",
            "advertiser_classified_at",
            "title",
            "contact_phone",
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
            "content_hash",
            "latest_payload",
            "created_at",
            "updated_at",
        )


class ListingStatusHistorySerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(
        source="listing.title",
        read_only=True,
    )
    changed_by_username = serializers.CharField(
        source="changed_by.full_name",
        read_only=True,
        allow_null=True,
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


class ListingReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ("review_status",)


class BulkListingReviewSerializer(serializers.Serializer):
    listing_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        allow_empty=False,
    )
    review_status = serializers.ChoiceField(
        choices=Listing.ReviewStatus.choices,
    )

    def validate_listing_ids(self, value):
        # Preserve request order while rejecting duplicate ids.
        if len(value) != len(set(value)):
            raise serializers.ValidationError(
                "listing_ids must not contain duplicates."
            )
        return value


class ListingPromotionSerializer(serializers.Serializer):
    owner = serializers.PrimaryKeyRelatedField(
        queryset=Owner.objects.none()
    )
    deal_type = serializers.ChoiceField(
        choices=Property.DealType.choices
    )
    area = serializers.IntegerField(
        min_value=1,
        required=False,
        allow_null=True,
    )
    title = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
    )
    address = serializers.PrimaryKeyRelatedField(
        queryset=Address.objects.all(),
        required=False,
        allow_null=True,
    )
    property_type = serializers.CharField(
        max_length=30,
        required=False,
        allow_blank=True,
        allow_null=True,
    )
    floor = serializers.IntegerField(
        required=False,
        allow_null=True,
    )
    total_floors = serializers.IntegerField(
        min_value=1,
        required=False,
        allow_null=True,
    )

    def __init__(self, *args, listing=None, actor=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.listing = listing
        self.actor = actor

        if actor and getattr(actor, "agency_id", None):
            self.fields["owner"].queryset = Owner.objects.filter(
                agency_id=actor.agency_id
            )

    def validate(self, attrs):
        if not self.listing:
            raise serializers.ValidationError(
                {"detail": "Listing is required."}
            )

        if self.listing.property_id:
            raise serializers.ValidationError(
                {"detail": "This listing has already been promoted."}
            )

        area = attrs.get("area")
        if not area and not self.listing.listed_area:
            raise serializers.ValidationError(
                {"area": "Area is required before promoting a listing."}
            )

        return attrs
