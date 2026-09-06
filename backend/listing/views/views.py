from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Count
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import HasRolePermission
from ingestion.services.promotion import promote_listing
from listing.filters import ListingFilter
from listing.models import Listing
from listing.selectors import ListingSelector
from listing.serializers.listing import (
    BulkListingReviewSerializer,
    ListingDetailSerializer,
    ListingListSerializer,
    ListingPromotionSerializer,
    ListingReviewSerializer,
)


class ListingPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class ListingListView(generics.ListAPIView):
    serializer_class = ListingListSerializer

    permission_classes = (HasRolePermission,)
    required_permission = "view_listing"

    pagination_class = ListingPagination

    filter_backends = (
        DjangoFilterBackend,
    )
    filterset_class = ListingFilter

    def get_queryset(self):
        return ListingSelector.for_user(
            self.request.user
        )


class ListingDetailView(generics.RetrieveAPIView):
    serializer_class = ListingDetailSerializer

    permission_classes = (HasRolePermission,)
    required_permission = "view_listing"

    def get_queryset(self):
        return ListingSelector.for_user(
            self.request.user
        )


class ListingReviewView(generics.UpdateAPIView):
    serializer_class = ListingReviewSerializer

    permission_classes = (HasRolePermission,)
    required_permission = "review_listing"

    def get_queryset(self):
        return ListingSelector.for_user(
            self.request.user
        )

    def update(self, request, *args, **kwargs):
        listing = self.get_object()

        serializer = self.get_serializer(
            listing,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data["review_status"]

        if listing.review_status != new_status:
            listing.review_status = new_status
            listing.save(
                update_fields=[
                    "review_status",
                    "updated_at",
                ]
            )

        return Response(
            ListingDetailSerializer(
                listing,
                context=self.get_serializer_context(),
            ).data,
            status=status.HTTP_200_OK,
        )


class ListingBulkReviewView(APIView):
    permission_classes = (HasRolePermission,)
    required_permission = "review_listing"

    def put(self, request):
        serializer = BulkListingReviewSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)

        listing_ids = serializer.validated_data["listing_ids"]
        review_status = serializer.validated_data["review_status"]

        listings = list(
            ListingSelector.for_user(
                request.user
            ).filter(
                id__in=listing_ids
            )
        )

        found_ids = {
            listing.id
            for listing in listings
        }

        missing_ids = sorted(
            set(listing_ids) - found_ids
        )

        if missing_ids:
            return Response(
                {
                    "detail": "Some listings do not exist or you do not have access to them.",
                    "missing_ids": missing_ids,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        updated_count = 0

        with transaction.atomic():
            for listing in listings:
                if listing.review_status != review_status:
                    listing.review_status = review_status

                    listing.save(
                        update_fields=[
                            "review_status",
                            "updated_at",
                        ]
                    )

                    updated_count += 1

        return Response(
            {
                "updated_count": updated_count,
                "review_status": review_status,
                "listing_ids": listing_ids,
            },
            status=status.HTTP_200_OK,
        )


class ListingCountsView(APIView):
    """Return counts per advertiser_type for tab badges."""

    permission_classes = (HasRolePermission,)
    required_permission = "view_listing"

    def get(self, request):
        qs = ListingSelector.for_user(request.user)

        all_count = qs.count()

        # Count by advertiser_type among successfully classified listings
        classified = qs.filter(
            advertiser_classification_status=Listing.AdvertiserClassificationStatus.SUCCEEDED,
        )
        agency_count = classified.filter(
            advertiser_type=Listing.AdvertiserType.AGENCY,
        ).count()
        owner_count = classified.filter(
            advertiser_type=Listing.AdvertiserType.OWNER,
        ).count()
        pending_count = all_count - agency_count - owner_count

        return Response({
            "all": all_count,
            "agency": agency_count,
            "owner": owner_count,
            "pending": pending_count,
        })

class ListingPromoteView(APIView):
    permission_classes = (HasRolePermission,)
    required_permission = "promote_listing"

    def post(self, request, pk):
        listing = get_object_or_404(
            ListingSelector.for_user(
                request.user
            ),
            pk=pk,
        )

        serializer = ListingPromotionSerializer(
            data=request.data,
            listing=listing,
            actor=request.user,
        )

        serializer.is_valid(
            raise_exception=True
        )

        try:
            property_record = promote_listing(
                listing=listing,
                actor=request.user,
                **serializer.validated_data,
            )

        except ValidationError as error:
            detail = (
                error.message_dict
                if hasattr(error, "message_dict")
                else error.messages
            )

            return Response(
                {"detail": detail},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "listing_id": listing.pk,
                "property_id": property_record.pk,
                "property_code": property_record.property_code,
                "review_status": Listing.ReviewStatus.PROMOTED,
            },
            status=status.HTTP_201_CREATED,
        )