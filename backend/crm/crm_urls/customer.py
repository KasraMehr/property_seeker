from django.urls import path

from crm.views.customers import (
    CustomerListCreateView,
    CustomerDetailView
)


urlpatterns=[


    path(
        "customers/",
        CustomerListCreateView.as_view(),
        name="customer-list-create"
    ),


    path(
        "customers/<int:pk>/",
        CustomerDetailView.as_view(),
        name="customer-detail"
    ),

]