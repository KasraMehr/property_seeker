from django.urls import path

from locations.views.district import (
    DistrictListCreateView,
    DistrictDetailView,
)

urlpatterns = [
    path(
        "district/",
        DistrictListCreateView.as_view(),
        name="district-list-create",
    ),

    path(
        "district/<int:pk>/",
        DistrictDetailView.as_view(),
        name="district-detail",
    ),

]