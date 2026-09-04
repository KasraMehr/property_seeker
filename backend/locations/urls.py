from django.urls import include, path

urlpatterns = [
    path("", include("locations.location_urls.address")),
    path("", include("locations.location_urls.city")),
    path("", include("locations.location_urls.neighborhood")),
    path("", include("locations.location_urls.province")),
    path("", include("locations.location_urls.district")),
    path("", include("locations.location_urls.divar")),
]
