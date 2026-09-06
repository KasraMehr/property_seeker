from listing.models import Listing


class ListingSelector:

    @staticmethod
    def for_user(user):
        qs = (
            Listing.objects
            .select_related(
                "source",
                "divar_neighborhood__zone",
                "divar_neighborhood__city",
                "divar_neighborhood__city__province",
            )
            .order_by("-last_seen_at", "-id")
        )

        # Owner can access all listings
        if user.is_owner:
            return qs

        return qs.filter(
            category=user.deal_type_scope,
            divar_neighborhood__in=user.service_neighborhoods.all(),
        )