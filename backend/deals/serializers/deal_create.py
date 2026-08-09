from rest_framework import serializers

from accounts.models import User
from crm.models import Customer
from deals.models import Deal
from listing.models import Listing
from properties.models import Property


class DealCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Deal

        exclude = (
            "agency",
            "deal_number",
            "created_by",
            "updated_by",
            "created_at",
            "updated_at",
            "is_deleted",
        )


    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request:

            agency = request.user.agency


            self.fields["property"].queryset = (
                Property.objects.filter(
                    agency=agency
                )
            )


            self.fields["agent"].queryset = (
                User.objects.filter(
                    agency=agency,
                    is_active=True
                )
            )


            self.fields["customer"].queryset = (
                Customer.objects.filter(
                    agency=agency
                )
            )


            self.fields["listing"].queryset = (
                Listing.objects.filter(
                    agency=agency
                )
            )


    def create(self, validated_data):

        user = self.context["request"].user


        deal = Deal.objects.create(
            agency=user.agency,
            created_by=user,
            **validated_data
        )


        return deal