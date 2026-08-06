
from django.urls import path,include


urlpatterns = [
    path("",include('crm.crm_urls.tag')),
path("",include('crm.crm_urls.call_log')),
path("",include('crm.crm_urls.customer')),
path("",include('crm.crm_urls.property_visit')),
path("",include('crm.crm_urls.customer_preference')),
path("",include('crm.crm_urls.reminder')),
]