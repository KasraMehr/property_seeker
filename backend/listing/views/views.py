from rest_framework import generics

from listing.models import Listing
from listing.serializers.listing import (
    ListingListSerializer,
    ListingDetailSerializer,
)
from accounts.permissions import *

class ListingListView(generics.ListAPIView):
    queryset = (
        Listing.objects
        .select_related("source")
        .all()
    )

    serializer_class = ListingListSerializer
    permission_classes = (HasRolePermission,)
    required_permission = "view_listing"

class ListingDetailView(generics.RetrieveAPIView):
    queryset = (
        Listing.objects
        .select_related("source")
        .all()
    )

    serializer_class = ListingDetailSerializer
    permission_classes = (HasRolePermission,)
    required_permission = "detail_listing"

# Create your views here.
from listing.models import ListingStatusHistory
from listing.serializers.listing import (
    ListingStatusHistorySerializer
)


class ListingStatusHistoryListView(
    generics.ListAPIView
):

    serializer_class = ListingStatusHistorySerializer
    permission_classes = (HasRolePermission,)
    required_permission = "view_status_history"

    def get_queryset(self):

        listing_id = self.kwargs.get(
            "listing_id"
        )

        return (
            ListingStatusHistory.objects
            .filter(
                listing_id=listing_id
            )
            .select_related(
                "listing",
                "changed_by"
            )
        )



class ListingStatusHistoryDetailView(
    generics.RetrieveAPIView
):

    queryset = (
        ListingStatusHistory.objects
        .select_related(
            "listing",
            "changed_by"
        )
    )

    serializer_class = ListingStatusHistorySerializer
    permission_classes = (HasRolePermission,)
    required_permission = "detail_status_history"

