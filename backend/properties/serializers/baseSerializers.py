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
        self.fields["owner"].queryset = Owner.objects.filter(
            agency=user.agency
        )

        # فقط ایجنت‌های فعال همین آژانس
        self.fields["agent"].queryset = User.objects.filter(
            agency=user.agency,
            is_active=True,
            is_owner=False,
        )

        # Owner آژانس همه آدرس‌ها را می‌بیند
        if user.is_owner:
            self.fields["address"].queryset = Address.objects.all()
        else:
            # کاربر معمولی فقط آدرس‌های محله‌های خودش
            self.fields["address"].queryset = Address.objects.filter(
                neighborhood__in=user.service_neighborhoods.all()
            )

    def validate(self, attrs):
        attrs = super().validate(attrs)

        request = self.context["request"]
        user = request.user

        address = attrs.get(
            "address",
            getattr(self.instance, "address", None),
        )

        # آیا کاربر Agent را خودش انتخاب کرده؟
        agent_was_provided = "agent" in attrs

        agent = attrs.get(
            "agent",
            getattr(self.instance, "agent", None),
        )

        if address:

            neighborhood = address.neighborhood

            # ==================================================
            # Agent خودکار
            # ==================================================

            if not agent_was_provided and self.instance is None:
                agents = User.objects.filter(
                    agency=user.agency,
                    is_active=True,
                    is_owner=False,
                    service_neighborhoods=neighborhood,
                ).distinct()

                if agents.count() == 1:
                    # فقط یک Agent مناسب وجود دارد
                    attrs["agent"] = agents.first()
                    agent = attrs["agent"]

                elif agents.count() == 0:
                    raise serializers.ValidationError(
                        {
                            "agent": (
                                "برای این محله هیچ مشاور فعالی "
                                "وجود ندارد."
                            )
                        }
                    )

                else:
                    # چند Agent مناسب وجود دارد
                    raise serializers.ValidationError(
                        {
                            "agent": (
                                "برای این محله چند مشاور فعال وجود دارد. "
                                "لطفاً مشاور را انتخاب کنید."
                            )
                        }
                    )

            # ==================================================
            # بررسی Agent
            # ==================================================

            if agent:
                if not agent.service_neighborhoods.filter(
                    id=neighborhood.id
                ).exists():
                    raise serializers.ValidationError(
                        {
                            "agent": (
                                "مشاور انتخاب شده در این محله "
                                "فعالیت ندارد."
                            )
                        }
                    )

        return attrs

    def validate_owner(self, owner):
        user = self.context["request"].user

        if owner.agency != user.agency:
            raise serializers.ValidationError(
                "مالک متعلق به آژانس شما نیست."
            )

        return owner

    def validate_agent(self, agent):
        user = self.context["request"].user

        if agent.agency != user.agency:
            raise serializers.ValidationError(
                "مشاور متعلق به آژانس شما نیست."
            )

        if not agent.is_active:
            raise serializers.ValidationError(
                "این مشاور فعال نیست."
            )

        if agent.is_owner:
            raise serializers.ValidationError(
                "مالک آژانس نمی‌تواند به عنوان مشاور انتخاب شود."
            )

        return agent

    def validate_address(self, address):
        user = self.context["request"].user

        # Owner آژانس محدودیت محله ندارد
        if user.is_owner:
            return address

        # کاربر فقط در محدوده خودش می‌تواند ملک ثبت کند
        if not user.service_neighborhoods.filter(
            id=address.neighborhood_id
        ).exists():
            raise serializers.ValidationError(
                "این محله در محدوده فعالیت شما نیست."
            )

        return address
