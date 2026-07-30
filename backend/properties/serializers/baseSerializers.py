from rest_framework import serializers

from accounts.models import User
from locations.models import Address
from properties.models import (
    Owner,
    Property,
)


class BasePropertySerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if not request:
            return

        user = request.user

        self.fields["owner"].queryset = Owner.objects.filter(
            agency=user.agency
        )

        self.fields["agent"].queryset = User.objects.filter(
            agency=user.agency,
            is_active=True,
        )

        if user.is_owner:
            self.fields["address"].queryset = Address.objects.all()
        else:
            self.fields["address"].queryset = Address.objects.filter(
                neighborhood__district__in=user.service_districts.all()
            )

    def validate(self, attrs):

        attrs = super().validate(attrs)

        request = self.context["request"]
        user = request.user

        address = attrs.get(
            "address",
            getattr(self.instance, "address", None)
        )

        agent = attrs.get(
            "agent",
            getattr(self.instance, "agent", None)
        )

        if address and agent:

            district = address.neighborhood.district

            if not agent.service_districts.filter(
                    id=district.id
            ).exists():
                raise serializers.ValidationError(
                    {
                        "agent": "مشاور انتخاب شده اجازه فعالیت در این منطقه را ندارد."
                    }
                )

        return attrs

    def validate_owner(self, owner):

        if owner.agency != self.context["request"].user.agency:
            raise serializers.ValidationError(
                "مالک متعلق به آژانس شما نیست."
            )

        return owner

    def validate_agent(self, agent):

        if agent.agency != self.context["request"].user.agency:
            raise serializers.ValidationError(
                "مشاور متعلق به آژانس شما نیست."
            )

        return agent

    def validate_address(self, address):

        user = self.context["request"].user

        if user.is_owner:
            return address

        if not user.service_districts.filter(
            id=address.neighborhood.district_id
        ).exists():
            raise serializers.ValidationError(
                "این منطقه در محدوده فعالیت شما نیست."
            )

        return address