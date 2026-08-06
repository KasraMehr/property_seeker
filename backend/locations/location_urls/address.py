from django.urls import path

from locations.views.address import (
    AddressListCreateView,
    AddressDetailView,
)

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
]