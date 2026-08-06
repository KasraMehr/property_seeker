from django.urls import path,include


urlpatterns = [
    path("",include('deals.deal_urls.deal_url')),
path("",include('deals.deal_urls.contract')),
    path("",include('deals.deal_urls.contract_history')),


]