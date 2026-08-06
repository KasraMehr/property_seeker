from django.urls import path

from crm.views.call_log import (
    CallLogListCreateView,
    CallLogDetailView
)

urlpatterns = [

    path(
        "calls/",
        CallLogListCreateView.as_view(),
        name="call-list-create"
    ),

    path(
        "calls/<int:pk>/",
        CallLogDetailView.as_view(),
        name="call-detail"
    ),
]