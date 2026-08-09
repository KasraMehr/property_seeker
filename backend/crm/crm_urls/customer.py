from django.urls import path

from crm.views.customers import CustomerDetailView, CustomerListCreateView,CustomerBulkDeleteView

urlpatterns = [
    path("customers/", CustomerListCreateView.as_view(), name="customer-list-create"),
    path("customers/<int:pk>/", CustomerDetailView.as_view(), name="customer-detail"),
    path("customer/delete", CustomerBulkDeleteView.as_view(), name="customer-bulk-delete"),
]
