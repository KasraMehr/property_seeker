from django.urls import path

from listing.views.views import *

urlpatterns = [

    path("list/",ListingListView.as_view(),name="listing"),
    path("detail/<int:pk>/",ListingDetailView.as_view(),name="detail"),
]
