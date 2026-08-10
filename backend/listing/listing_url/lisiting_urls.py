from django.urls import path

from listing.views.views import (
    ListingBulkReviewView,
    ListingDetailView,
    ListingListView,
    ListingPromoteView,
    ListingReviewView,
)


urlpatterns = [
    path(
        "list/",
        ListingListView.as_view(),
        name="listing-list",
    ),

    path(
        "detail/<int:pk>/",
        ListingDetailView.as_view(),
        name="listing-detail",
    ),

    path(
        "<int:pk>/review/",
        ListingReviewView.as_view(),
        name="listing-review",
    ),

    path(
        "bulk/review-change-status/",
        ListingBulkReviewView.as_view(),
        name="listing-bulk-review",
    ),

    path(
        "<int:pk>/promote/",
        ListingPromoteView.as_view(),
        name="listing-promote",
    ),
]