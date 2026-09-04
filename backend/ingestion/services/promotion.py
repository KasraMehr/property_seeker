from django.core.exceptions import ValidationError
from django.db import transaction

from listing.models import Listing
from properties.models import Property


@transaction.atomic
def promote_listing(
    *,
    listing,
    actor,
    owner,
    deal_type,
    area=None,
    title=None,
    address=None,
    property_type=None,
    floor=None,
    total_floors=None,
):
    listing = Listing.objects.select_for_update().get(pk=listing.pk)
    if listing.property_id:
        raise ValidationError("This listing has already been promoted.")
    if actor.agency_id != owner.agency_id:
        raise ValidationError(
            "The owner and promoting agent must belong to the same agency."
        )
    resolved_area = area or listing.listed_area
    if not resolved_area:
        raise ValidationError("Area is required before promoting a listing.")

    age = 0
    if listing.build_year:
        try:
            import jdatetime

            age = max(0, jdatetime.date.today().year - listing.build_year)
        except (ValueError, TypeError):
            age = 0

    property_record = Property.objects.create(
        agency=owner.agency,
        owner=owner,
        agent=actor,
        create_by=actor,
        address=address,
        divar_neighborhood=listing.divar_neighborhood,
        title=title or listing.title,
        property_type=property_type,
        deal_type=deal_type,
        area=resolved_area,
        floor=floor if floor is not None else listing.floor_number,
        total_floors=total_floors if total_floors is not None else listing.total_floors,
        age=age,
        bedrooms=listing.room_count or 0,
        description=listing.description,
        price_per_meter=listing.listed_price_per_meter,
        sale_price=listing.listed_sale_price,
        mortgage_amount=listing.listed_mortgage_amount,
        deposit_amount=listing.listed_deposit_amount,
        monthly_rent=listing.listed_rent_amount,
        status=Property.Status.AVAILABLE,
    )
    listing.property = property_record
    listing.review_status = Listing.ReviewStatus.PROMOTED
    listing.save(update_fields=["property", "review_status", "updated_at"])
    return property_record
