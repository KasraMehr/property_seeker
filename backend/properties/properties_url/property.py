from django.urls import path

from ..views.property import *


app_name = "properties"

urlpatterns = [

  path("property/list/",PropertyListView.as_view(), name="property-list"),
    path("property/create/",PropertyCreateView.as_view(), name="property-create"),
    path("property/update/<int:pk>/",PropertyUpdateView.as_view(), name="property-update"),
    path("property/delete/<int:pk>/",PropertyDeleteView.as_view(), name="property-delete"),
    path("property/detail/<int:pk>/",PropertyDetailView.as_view(), name="property-detail"),
]