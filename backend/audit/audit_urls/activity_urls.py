from django.urls import path

from audit.views.views import (
    ActivityLogListView,
    ActivityLogDetailView,
)

urlpatterns = [

    path(
        "activity/list/",
        ActivityLogListView.as_view(),
        name="activity-list",
    ),

    path(
        "activity/detail/<int:pk>/",
        ActivityLogDetailView.as_view(),
        name="activity-detail",
    ),

]