
from django.urls import path,include


urlpatterns = [
    path("",include('audit.audit_urls.activity_urls')),


]