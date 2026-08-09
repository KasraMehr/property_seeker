from django.urls import path

from locations.views.city import (
    CityCreateView,
    CityDetailView,
    CityListView,
    CityUpdateView,CityBulkDeleteView
)

urlpatterns = [
    path(
        "city/create/",
        CityCreateView.as_view(),
        name="city-create",
    ),
    path(
        "city/list/",
        CityListView.as_view(),
        name="city-list",
    ),
    path(
        "city/<int:pk>/",
        CityDetailView.as_view(),
        name="city-detail",
    ),
    path(
        "city/<int:pk>/update/",
        CityUpdateView.as_view(),
        name="city-update",
    ),
    path(
        "city/<int:pk>/delete/",
        CityBulkDeleteView.as_view(),
        name="city-delete",
    ),
]
