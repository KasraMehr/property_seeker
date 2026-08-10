"""
URL configuration for amlak project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path

from accounts.urls import *

# from media.urls import *
from audit.urls import *
from locations.urls import *
from properties.urls import *

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/", include("properties.urls")),
    path("api/", include("media.urls")),
    path("api/audit/", include("audit.urls")),
    path("api/", include("locations.urls")),
    # path("api/",include("deals.urls")),
    path("api/", include("crm.urls")),
    path("api/", include("report.urls")),
    path("api/listing/",include("listing.urls")),
path("api/ingestion/", include("ingestion.urls")),
]
