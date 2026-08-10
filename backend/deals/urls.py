from django.urls import include, path

urlpatterns = [
    path("",include('deals.deal_urls.deal_url')),
path("",include('deals.deal_urls.contract')),
    path("",include('deals.deal_urls.contract_history')),


]