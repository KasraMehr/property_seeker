from django.urls import path

from ..views.feature import *
from ..views.property_feature import *

urlpatterns = [

    # =========================
    # Feature
    # =========================
    path(
        "features/create/",
        FeatureCreateView.as_view(),
        name="feature-create",
    ),

    path(
        "features/list/",
        FeatureListView.as_view(),
        name="feature-list",
    ),

    path(
        "features/detail/<int:pk>/",
        FeatureDetailView.as_view(),
        name="feature-detail",
    ),

    path(
        "features/update/<int:pk>/",
        FeatureUpdateView.as_view(),
        name="feature-update",
    ),

    path(
        "features/delete/<int:pk>/",
        FeatureDeleteView.as_view(),
        name="feature-delete",
    ),

    # =========================
    # Property Feature
    # =========================
    path(
        "property-features/create/",
        PropertyFeatureCreateView.as_view(),
        name="property-feature-create",
    ),

    path(
        "property-features/list/",
        PropertyFeatureListView.as_view(),
        name="property-feature-list",
    ),
path(
        "property-features/update/<int:pk>/",
        PropertyFeatureUpdateView.as_view(),
        name="property-feature-detail",
    ),

    path(
        "property-features/detail/<int:pk>/",
        PropertyFeatureDetailView.as_view(),
        name="property-feature-detail",
    ),

    path(
        "property-features/delete/<int:pk>/",
        PropertyFeatureDeleteView.as_view(),
        name="property-feature-delete",
    ),
]