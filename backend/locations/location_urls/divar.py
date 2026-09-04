from django.urls import path

from locations.views.divar import (
    DivarNeighborhoodDetailView,
    DivarNeighborhoodListView,
    DivarNeighborhoodSyncView,
    ZoneListView,
)


urlpatterns = [
    path("zones/", ZoneListView.as_view(), name="zone-list"),
    path(
        "divar-neighborhoods/",
        DivarNeighborhoodListView.as_view(),
        name="divar-neighborhood-list",
    ),
    path(
        "divar-neighborhoods/<int:pk>/",
        DivarNeighborhoodDetailView.as_view(),
        name="divar-neighborhood-detail",
    ),
    path(
        "divar-neighborhoods/sync/",
        DivarNeighborhoodSyncView.as_view(),
        name="divar-neighborhood-sync",
    ),
]
