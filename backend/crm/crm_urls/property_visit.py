from django.urls import path

from ..views.property_visit import *


urlpatterns = [

    path(
        "visits/",
        PropertyVisitListView.as_view()
    ),


    path(
        "visits/create/",
        PropertyVisitCreateView.as_view()
    ),


    path(
        "visits/<int:pk>/",
        PropertyVisitDetailView.as_view()
    ),


    path(
        "visits/update/<int:pk>/",
        PropertyVisitUpdateView.as_view()
    ),

]