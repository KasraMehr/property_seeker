from django.urls import path

from crm.views.tag import (
    TagListCreateView,
    TagDetailView
)



urlpatterns = [

    path(
        "tags/",
        TagListCreateView.as_view(),
        name="tag-list-create"
    ),


    path(
        "tags/<int:pk>/",
        TagDetailView.as_view(),
        name="tag-detail"
    ),

]