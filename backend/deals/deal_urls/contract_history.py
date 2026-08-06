from django.urls import path


from ..views.contract_history import (
    ContractHistoryListView,
    ContractHistoryDetailView,
)



urlpatterns = [


    # تاریخچه یک قرارداد
    path(
        "contracts/<int:contract_id>/history/",
        ContractHistoryListView.as_view(),
        name="contract-history-list"
    ),



    # جزئیات یک تغییر
    path(
        "contract-history/<int:pk>/",
        ContractHistoryDetailView.as_view(),
        name="contract-history-detail"
    ),

]