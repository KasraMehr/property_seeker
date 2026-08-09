from django.urls import path

from listing.views.views import *

urlpatterns = [

    path("lisiting-history/list/",ListingStatusHistoryDetailView.as_view(),name="lisiting-history-list"),
    path("listing-history/detail/<int:pk>",ListingDetailView.as_view(),name="listing-detail"),
]
