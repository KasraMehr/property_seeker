from django import forms

from locations.models import Address
from properties.models import Owner, Property


class PromoteListingForm(forms.Form):
    owner = forms.ModelChoiceField(queryset=Owner.objects.all())
    deal_type = forms.ChoiceField(choices=Property.DealType.choices)
    title = forms.CharField(max_length=255, required=False)
    area = forms.IntegerField(min_value=1, required=False)
    address = forms.ModelChoiceField(queryset=Address.objects.all(), required=False)
    property_type = forms.CharField(max_length=30, required=False)
    floor = forms.IntegerField(required=False)
    total_floors = forms.IntegerField(min_value=1, required=False)

    def __init__(self, *args, listing=None, actor=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.listing = listing
        if actor and actor.agency_id:
            self.fields["owner"].queryset = Owner.objects.filter(
                agency_id=actor.agency_id
            )
        else:
            self.fields["owner"].queryset = Owner.objects.none()
        if listing:
            self.fields["title"].initial = listing.title
            self.fields["area"].initial = listing.listed_area
            self.fields["floor"].initial = listing.floor_number
            self.fields["total_floors"].initial = listing.total_floors

    def clean(self):
        cleaned = super().clean()
        if not cleaned.get("area") and not getattr(self.listing, "listed_area", None):
            self.add_error("area", "Area is required because Divar did not publish it.")
        return cleaned
