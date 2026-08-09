from django.urls import path

from ..views.owner import *

urlpatterns = [
    path("owner/create/", OwnerCreateView.as_view(), name="owner_create"),
    path("owner/list/", OwnerListView.as_view(), name="owner_list"),
    path("owner/update/<int:pk>/", OwnerUpdateView.as_view(), name="owner_update"),
    path("owner/bulk-delete/", OwnerBulkDeleteView.as_view(), name="owner_delete"),
    path("owner/detail/<int:pk>/", OwnerDetailView.as_view(), name="owner_edit"),
]
