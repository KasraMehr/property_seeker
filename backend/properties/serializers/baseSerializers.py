from rest_framework import serializers

from accounts.models import User
from locations.models import Address
from properties.models import Owner


class BasePropertySerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if not request:
            return

        user = request.user

        # فقط مالک‌های همین آژانس
        self.fields["owner"].queryset = Owner.objects.filter(agency=user.agency)

        # فقط ایجنت‌های همین آژانس
        self.fields["agent"].queryset = User.objects.filter(
            agency=user.agency, is_active=True, is_owner=False
        )

        # مالک آژانس همه آدرس‌ها را ببیند
        if user.is_owner:

            self.fields["address"].queryset = Address.objects.all()

        else:

            # فقط محله‌هایی که خودش سرویس می‌دهد
            self.fields["address"].queryset = Address.objects.filter(
                neighborhood__in=user.service_neighborhoods.all()
            )

    def validate(self, attrs):

        attrs = super().validate(attrs)

        request = self.context["request"]

        address = attrs.get("address", getattr(self.instance, "address", None))

        agent = attrs.get("agent", getattr(self.instance, "agent", None))

        if address and agent:

            neighborhood = address.neighborhood

            # بررسی می‌کنیم ایجنت در این محله فعال است یا نه

            if not agent.service_neighborhoods.filter(id=neighborhood.id).exists():

                raise serializers.ValidationError(
                    {"agent": "مشاور انتخاب شده در این محله فعالیت ندارد."}
                )

        return attrs

    def validate_owner(self, owner):

        user = self.context["request"].user

        if owner.agency != user.agency:

            raise serializers.ValidationError("مالک متعلق به آژانس شما نیست.")

        return owner

    def validate_agent(self, agent):

        user = self.context["request"].user

        if agent.agency != user.agency:

            raise serializers.ValidationError("مشاور متعلق به آژانس شما نیست.")

        return agent

    def validate_address(self, address):

        user = self.context["request"].user

        # مدیر آژانس محدودیت ندارد
        if user.is_owner:

            return address

        # بررسی محله
        if not user.service_neighborhoods.filter(id=address.neighborhood_id).exists():

            raise serializers.ValidationError("این محله در محدوده فعالیت شما نیست.")

        return address
