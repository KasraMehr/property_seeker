from django.core.exceptions import ValidationError
from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import HasRolePermission
from ingestion.services.promotion import promote_listing
from listing.models import Listing
from listing.serializers.listing import (
    BulkListingReviewSerializer,
    ListingDetailSerializer,
    ListingListSerializer,
    ListingPromotionSerializer,
    ListingReviewSerializer,
)

from rest_framework import generics
from rest_framework.pagination import PageNumberPagination


class ListingPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class ListingListView(generics.ListAPIView):
    queryset = (
        Listing.objects
        .select_related("source")
        .all()
        .order_by("-last_seen_at", "-id")
    )
    serializer_class = ListingListSerializer
    permission_classes = (HasRolePermission,)
    required_permission = "view_listing"
    pagination_class = ListingPagination



class ListingDetailView(generics.RetrieveAPIView):
    queryset = Listing.objects.select_related("source").all()
    serializer_class = ListingDetailSerializer
    permission_classes = (HasRolePermission,)
    required_permission = "view_listing"


class ListingReviewView(generics.UpdateAPIView):
    queryset = Listing.objects.select_related("source").all()
    serializer_class = ListingReviewSerializer
    permission_classes = (HasRolePermission,)
    required_permission = "review_listing"

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
            Listing.objects.filter(
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
                    "detail": "Some listings do not exist.",
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


class ListingPromoteView(APIView):
    permission_classes = (HasRolePermission,)
    required_permission = "promote_listing"

    def post(self, request, pk):
        listing = get_object_or_404(
            Listing.objects.select_related("source"),
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