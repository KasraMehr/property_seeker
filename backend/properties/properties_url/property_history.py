from django.urls import path

from properties.views.property_status_history import *

urlpatterns = [
    path(
        "property-status-history/",
        PropertyStatusHistoryListView.as_view(),
        name="property-status-history-list",
    ),
    path(
        "property-status-history/<int:pk>/",
        PropertyStatusHistoryDetailView.as_view(),
        name="property-status-history-detail",
    ),
]
