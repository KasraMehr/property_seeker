from django.urls import path

from deals.views.deal import (
    DealListCreateView,
    DealDetailView,
)


urlpatterns = [

    # لیست معاملات + ایجاد معامله
    path(
        "deals/",
        DealListCreateView.as_view(),
        name="deal-list-create"
    ),


    # جزئیات + ویرایش + حذف معامله
    path(
        "deals/<int:pk>/",
        DealDetailView.as_view(),
        name="deal-detail"
    ),

]