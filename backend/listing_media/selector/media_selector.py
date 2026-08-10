from django.shortcuts import get_object_or_404

from ..models import Media


class MediaSelector:

    @staticmethod
    def all():
        return (
            Media.objects
            .select_related(
                "property",
                "listing",
            )
            .order_by(
                "sort_order",
                "-created_at",
            )
        )

    @staticmethod
    def by_id(media_id):
        return get_object_or_404(
            Media.objects.select_related(
                "property",
                "listing",
            ),
            pk=media_id,
        )

    @staticmethod
    def by_property(property_id):
        return (
            Media.objects
            .filter(property_id=property_id)
            .select_related(
                "property",
                "listing",
            )
            .order_by(
                "sort_order",
                "-created_at",
            )
        )

    @staticmethod
    def by_listing(listing_id):
        return (
            Media.objects
            .filter(listing_id=listing_id)
            .select_related(
                "property",
                "listing",
            )
            .order_by(
                "sort_order",
                "-created_at",
            )
        )

    @staticmethod
    def main_image(property_id):
        return (
            Media.objects
            .filter(
                property_id=property_id,
                is_main=True,
            )
            .first()
        )