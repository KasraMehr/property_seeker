from django.urls import path

from locations.views.city import (
    CityCreateView,
    CityListView,
    CityDetailView,
    CityUpdateView,
    CityDeleteView,
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
        CityDeleteView.as_view(),
        name="city-delete",
    ),
]