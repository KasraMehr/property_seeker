from django.urls import path

from ..views.contract import *

urlpatterns = [

    # لیست قراردادها + ایجاد قرارداد
    path(
        "contracts/",
        ContractListCreateView.as_view(),
        name="contract-list-create"
    ),


    # جزئیات + ویرایش + حذف قرارداد
    path(
        "contracts/<int:pk>/",
        ContractDetailView.as_view(),
        name="contract-detail"
    ),

]