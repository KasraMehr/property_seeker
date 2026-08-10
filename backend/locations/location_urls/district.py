from django.urls import path

from locations.views.district import DistrictDetailView, DistrictBulkDeleteView,DistrictListCreateView

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
    path("district/delete",DistrictBulkDeleteView.as_view(), name="district-bulk-delete"),

]
