from django.urls import include, path

urlpatterns = [
    path("", include("listing.listing_url.lisiting_urls")),

]
