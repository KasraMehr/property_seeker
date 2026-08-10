from django.urls import path

from locations.views.address import AddressDetailView, AddressListCreateView,AddressBulkDeleteView

urlpatterns = [
    path(
        "addresses/",
        AddressListCreateView.as_view(),
        name="address-list-create",
    ),
    path(
        "addresses/<int:pk>/",
        AddressDetailView.as_view(),
        name="address-detail",
    ),
    path("address/delete/",AddressBulkDeleteView.as_view(),name="address-bulk-delete"),
]
