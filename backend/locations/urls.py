
from django.urls import path,include


urlpatterns = [
    path("",include('locations.location_urls.address')),
path("",include('locations.location_urls.city')),
path("",include('locations.location_urls.neighborhood')),
path("",include('locations.location_urls.province')),
path("",include('locations.location_urls.district')),

]