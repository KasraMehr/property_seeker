from django.urls import path

from  ..views.reminder import *


urlpatterns=[


    path(
        "reminders/",
        ReminderListView.as_view()
    ),


    path(
        "reminders/create/",
        ReminderCreateView.as_view()
    ),


    path(
        "reminders/<int:pk>/",
        ReminderDetailView.as_view()
    ),


    path(
        "reminders/update/<int:pk>/",
        ReminderUpdateView.as_view()
    ),


    path(
        "reminders/delete/<int:pk>/",
        ReminderDeleteView.as_view()
    ),


]