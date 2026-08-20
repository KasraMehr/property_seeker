from django.urls import path

from crm.views.customer_preference import (
    CustomerPreferenceDetailView,
    CustomerPreferenceListCreateView,CustomerPreferenceBulkDeleteView
)

urlpatterns = [
    path(
        "customer-preferences/",
        CustomerPreferenceListCreateView.as_view(),
        name="customer-preference-list-create",
    ),
    path(
        "customer-preferences/<int:pk>/",
        CustomerPreferenceDetailView.as_view(),
        name="customer-preference-detail",
    ),
    path("customer-preferences/delete/", CustomerPreferenceBulkDeleteView.as_view()),
]
