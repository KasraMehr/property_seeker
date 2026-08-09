from django.urls import include, path

urlpatterns = [
    path("", include("listing.listing_url.lisiting_urls")),
    path("", include("listing.listing_url.listing_hisoty_urls")),

]
