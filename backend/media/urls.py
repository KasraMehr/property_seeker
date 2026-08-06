from django.urls import path

from media.views.views import  *


urlpatterns = [
    path(
        "media/list/",
        MediaListView.as_view(),
        name="media-list",
    ),
    path(
        "media/create/",
        MediaCreateView.as_view(),
        name="media-create",
    ),
    path(
        "media/detail/<int:pk>/",
        MediaDetailView.as_view(),
        name="media-detail",
    ),
    path(
        "medai/update/<int:pk>/",
        MediaUpdateView.as_view(),
        name="media-update",
    ),
    path(
        "media/delete/<int:pk>/",
        MediaDeleteView.as_view(),
        name="media-delete",
    ),
]