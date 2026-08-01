from django.urls import path

from locations.views.province import *

urlpatterns = [

    path(
        "province/create/",
        ProvinceCreateView.as_view(),
        name="province-create",
    ),

    path(
        "province/list/",
        ProvinceListView.as_view(),
        name="province-list",
    ),

    path(
        "province/<int:pk>/",
        ProvinceDetailView.as_view(),
        name="province-detail",
    ),

    path(
        "province/<int:pk>/update/",
        ProvinceUpdateView.as_view(),
        name="province-update",
    ),

    path(
        "province/<int:pk>/delete/",
        ProvinceDeleteView.as_view(),
        name="province-delete",
    ),
]