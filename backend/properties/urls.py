from django.urls import include, path

app_name = "properties"

urlpatterns = [
    path("", include("properties.properties_url.owner")),
    path("", include("properties.properties_url.property")),
    path("", include("properties.properties_url.feature_property")),
    path("", include("properties.properties_url.property_history")),
]
