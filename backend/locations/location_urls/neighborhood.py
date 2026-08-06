from django.urls import path

from locations.views.neighborhood import (
    NeighborhoodListCreateView,
    NeighborhoodDetailView,
)

urlpatterns = [
    path(
        "neighborhoods/",
        NeighborhoodListCreateView.as_view(),
        name="neighborhood-list-create",
    ),

    path(
        "neighborhoods/<int:pk>/",
        NeighborhoodDetailView.as_view(),
        name="neighborhood-detail",
    ),
]