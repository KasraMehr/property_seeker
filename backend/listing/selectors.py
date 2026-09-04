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
            )
            .order_by("-last_seen_at", "-id")
        )

        # Owner can access all listings
        if user.is_owner:
            return qs

        # Regular users:
        # only listings matching their deal type
        # and assigned service neighborhoods
        return qs.filter(
            category=user.deal_type_scope,
            divar_neighborhood__in=user.service_neighborhoods.all(),
        )