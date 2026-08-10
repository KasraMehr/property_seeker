from django.urls import path

from audit.views.views import ActivityLogDetailView, ActivityLogListView

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
