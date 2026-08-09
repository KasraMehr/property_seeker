from django.urls import include, path

urlpatterns = [
    path("", include("audit.audit_urls.activity_urls")),
]
