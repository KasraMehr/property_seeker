from django.urls import path

from crm.views.call_log import CallLogDetailView, CallLogListCreateView,CallLogBulkDeleteView

urlpatterns = [
    path("calls/", CallLogListCreateView.as_view(), name="call-list-create"),
    path("calls/<int:pk>/", CallLogDetailView.as_view(), name="call-detail"),
    path("calls/delete/",CallLogBulkDeleteView.as_view(), name="call-bulk-delete"),
]
