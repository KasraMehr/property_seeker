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

        # ==================================================
        # Owner های همان آژانس
        # ==================================================

        self.fields["owner"].queryset = Owner.objects.filter(
            agency=user.agency
        )

        # ==================================================
        # Agent های فعال همان آژانس
        # ==================================================

        self.fields["agent"].queryset = User.objects.filter(
            agency=user.agency,
            is_active=True,
            is_owner=False,
        )

        # ==================================================
        # Address
        # ==================================================

        if user.is_owner:
            # Owner آژانس به همه آدرس‌ها دسترسی دارد
            self.fields["address"].queryset = Address.objects.all()

        else:
            # Agent فقط آدرس‌های محله‌های خودش را می‌بیند
            self.fields["address"].queryset = Address.objects.filter(
                neighborhood__in=user.service_neighborhoods.all()
            )

    # ======================================================
    # Main validation
    # ======================================================

    def validate(self, attrs):
        attrs = super().validate(attrs)

        request = self.context["request"]
        user = request.user

        # ==================================================
        # مقادیر نهایی Property
        #
        # در Create از attrs استفاده می‌شود.
        # در Update اگر فیلدی ارسال نشده باشد،
        # مقدار فعلی instance استفاده می‌شود.
        # ==================================================

        address = attrs.get(
            "address",
            getattr(self.instance, "address", None),
        )

        deal_type = attrs.get(
            "deal_type",
            getattr(self.instance, "deal_type", None),
        )

        agent = attrs.get(
            "agent",
            getattr(self.instance, "agent", None),
        )

        # ==================================================
        # Owner آژانس
        # ==================================================

        # Owner محدودیت نوع معامله و محله ندارد.
        #
        # validate_owner / validate_agent همچنان
        # برای کنترل آژانس اجرا می‌شوند.
        # ==================================================

        if user.is_owner:
            return attrs

        # ==================================================
        # 1. بررسی نوع فعالیت User
        # ==================================================

        if deal_type is not None:
            if not user.can_access_deal_type(deal_type):
                raise serializers.ValidationError(
                    {
                        "deal_type": (
                            "شما فقط مجاز به ثبت یا ویرایش "
                            "ملک در محدوده نوع فعالیت خود هستید."
                        )
                    }
                )

        # ==================================================
        # 2. بررسی محله
        # ==================================================

        if address is not None:
            if not user.service_neighborhoods.filter(
                id=address.neighborhood_id
            ).exists():
                raise serializers.ValidationError(
                    {
                        "address": (
                            "این محله در محدوده فعالیت شما نیست."
                        )
                    }
                )

        # ==================================================
        # 3. انتخاب خودکار Agent در زمان Create
        # ==================================================

        agent_was_provided = "agent" in attrs

        if (
            self.instance is None
            and not agent_was_provided
            and address is not None
            and deal_type is not None
        ):
            agents = User.objects.filter(
                agency=user.agency,
                is_active=True,
                is_owner=False,
                service_neighborhoods=address.neighborhood,
                deal_type_scope=deal_type,
            ).distinct()

            # ----------------------------------------------
            # فقط یک Agent مناسب
            # ----------------------------------------------

            if agents.count() == 1:
                attrs["agent"] = agents.first()
                agent = attrs["agent"]

            # ----------------------------------------------
            # هیچ Agent مناسب وجود ندارد
            # ----------------------------------------------

            elif agents.count() == 0:
                raise serializers.ValidationError(
                    {
                        "agent": (
                            "برای این محله و نوع معامله "
                            "هیچ مشاور فعالی وجود ندارد."
                        )
                    }
                )

            # ----------------------------------------------
            # چند Agent مناسب وجود دارد
            # ----------------------------------------------

            else:
                raise serializers.ValidationError(
                    {
                        "agent": (
                            "برای این محله و نوع معامله "
                            "چند مشاور فعال وجود دارد. "
                            "لطفاً مشاور را انتخاب کنید."
                        )
                    }
                )

        # ==================================================
        # 4. بررسی Agent انتخاب شده
        # ==================================================

        if agent is not None:

            # ----------------------------------------------
            # Agent باید متعلق به همان Agency باشد
            # ----------------------------------------------

            if agent.agency_id != user.agency_id:
                raise serializers.ValidationError(
                    {
                        "agent": (
                            "مشاور متعلق به آژانس شما نیست."
                        )
                    }
                )

            # ----------------------------------------------
            # Agent باید فعال باشد
            # ----------------------------------------------

            if not agent.is_active:
                raise serializers.ValidationError(
                    {
                        "agent": (
                            "این مشاور فعال نیست."
                        )
                    }
                )

            # ----------------------------------------------
            # Owner نباید به عنوان Agent انتخاب شود
            # ----------------------------------------------

            if agent.is_owner:
                raise serializers.ValidationError(
                    {
                        "agent": (
                            "مالک آژانس نمی‌تواند "
                            "به عنوان مشاور انتخاب شود."
                        )
                    }
                )

            # ----------------------------------------------
            # Agent باید در محله Property فعالیت داشته باشد
            # ----------------------------------------------

            if address is not None:

                if not agent.service_neighborhoods.filter(
                    id=address.neighborhood_id
                ).exists():
                    raise serializers.ValidationError(
                        {
                            "agent": (
                                "مشاور انتخاب شده در این محله "
                                "فعالیت ندارد."
                            )
                        }
                    )

            # ----------------------------------------------
            # Agent باید در نوع معامله Property فعالیت داشته باشد
            # ----------------------------------------------

            if deal_type is not None:

                if not agent.can_access_deal_type(
                    deal_type
                ):
                    raise serializers.ValidationError(
                        {
                            "agent": (
                                "مشاور انتخاب شده در این نوع "
                                "معامله فعالیت ندارد."
                            )
                        }
                    )

        return attrs

    # ======================================================
    # Owner Validation
    # ======================================================

    def validate_owner(self, owner):
        user = self.context["request"].user

        if owner.agency_id != user.agency_id:
            raise serializers.ValidationError(
                "مالک متعلق به آژانس شما نیست."
            )

        return owner

    # ======================================================
    # Agent Validation
    # ======================================================

    def validate_agent(self, agent):
        user = self.context["request"].user

        # ----------------------------------------------
        # Agency
        # ----------------------------------------------

        if agent.agency_id != user.agency_id:
            raise serializers.ValidationError(
                "مشاور متعلق به آژانس شما نیست."
            )

        # ----------------------------------------------
        # Active
        # ----------------------------------------------

        if not agent.is_active:
            raise serializers.ValidationError(
                "این مشاور فعال نیست."
            )

        # ----------------------------------------------
        # Owner
        # ----------------------------------------------

        if agent.is_owner:
            raise serializers.ValidationError(
                "مالک آژانس نمی‌تواند به عنوان مشاور انتخاب شود."
            )

        return agent

    # ======================================================
    # Address Validation
    # ======================================================

    def validate_address(self, address):
        user = self.context["request"].user

        # Owner آژانس محدودیت محله ندارد
        if user.is_owner:
            return address

        # Agent فقط در محله‌های خودش می‌تواند Property
        # ایجاد یا ویرایش کند.
        if not user.service_neighborhoods.filter(
            id=address.neighborhood_id
        ).exists():
            raise serializers.ValidationError(
                "این محله در محدوده فعالیت شما نیست."
            )

        return address

    # ======================================================
    # Deal Type Validation
    # ======================================================

    def validate_deal_type(self, deal_type):
        user = self.context["request"].user

        # Owner آژانس محدودیت نوع معامله ندارد
        if user.is_owner:
            return deal_type

        # Agent فقط در نوع فعالیت خودش می‌تواند
        # Property ایجاد یا ویرایش کند.
        if not user.can_access_deal_type(deal_type):
            raise serializers.ValidationError(
                "شما مجاز به فعالیت در این نوع معامله نیستید."
            )

        return deal_type
