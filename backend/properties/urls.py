
from django.urls import path,include


urlpatterns = [
    path("",include('properties.properties_url.owner'))

]