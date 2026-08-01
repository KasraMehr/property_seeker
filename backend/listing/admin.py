from django.contrib import admin
from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import path, reverse

from ingestion.forms import PromoteListingForm
from ingestion.services.promotion import promote_listing
from .models import Listing, Source


@admin.register(Source)
class SourceAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at", "updated_at")
    search_fields = ("name",)


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = (
        "external_id",
        "title",
        "source",
        "status",
        "review_status",
        "listed_area",
        "listed_sale_price",
        "last_checked_at",
    )
    list_filter = ("source", "status", "review_status")
    search_fields = ("external_id", "title", "url", "description")
    readonly_fields = (
        "property",
        "external_id",
        "source",
        "url",
        "title",
        "description",
        "listed_sale_price",
        "listed_price_per_meter",
        "listed_mortgage_amount",
        "listed_deposit_amount",
        "listed_rent_amount",
        "listed_area",
        "build_year",
        "room_count",
        "floor_number",
        "total_floors",
        "pictures_match_property",
        "media_count",
        "published_at",
        "source_updated_at",
        "content_hash",
        "latest_payload",
        "first_seen_at",
        "last_seen_at",
        "last_checked_at",
        "last_changed_at",
    )

    def get_urls(self):
        return [
            path(
                "<int:object_id>/promote/",
                self.admin_site.admin_view(self.promote_view),
                name="listing_listing_promote",
            ),
        ] + super().get_urls()

    def promote_view(self, request, object_id):
        listing = get_object_or_404(Listing, pk=object_id)
        if listing.property_id:
            messages.info(request, "This listing has already been promoted.")
            return redirect(reverse("admin:listing_listing_change", args=[listing.pk]))
        form = PromoteListingForm(request.POST or None, listing=listing, actor=request.user)
        if request.method == "POST" and form.is_valid():
            property_record = promote_listing(
                listing=listing,
                actor=request.user,
                **form.cleaned_data,
            )
            messages.success(request, f"Created property {property_record.property_code}.")
            return redirect(reverse("admin:properties_property_change", args=[property_record.pk]))
        return render(
            request,
            "admin/listing/promote.html",
            {
                **self.admin_site.each_context(request),
                "opts": self.model._meta,
                "listing": listing,
                "form": form,
                "title": "Promote Divar listing",
            },
        )
