from rest_framework import serializers

from deals.models import Deal


class DealCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Deal
        fields = (
            "property",
            "listing",
            "agent",
            "customer",
            "deal_type",
            "price",
            "deposit_amount",
            "rent_amount",
            "commission_amount",
            "deal_date",
            "notes",
        )

    def validate(self, attrs):
        deal_type = attrs.get("deal_type")

        price = attrs.get("price")
        deposit = attrs.get("deposit_amount")
        rent = attrs.get("rent_amount")

        # -------- Sale --------
        if deal_type == Deal.DealType.SALE:

            if not price:
                raise serializers.ValidationError({
                    "price": "قیمت فروش الزامی است."
                })

            attrs["deposit_amount"] = None
            attrs["rent_amount"] = None

        # -------- Mortgage --------
        elif deal_type == Deal.DealType.MORTGAGE:

            if not deposit:
                raise serializers.ValidationError({
                    "deposit_amount": "مبلغ رهن الزامی است."
                })

            attrs["price"] = 0
            attrs["rent_amount"] = None

        # -------- Rent --------
        elif deal_type == Deal.DealType.RENT:

            if not rent:
                raise serializers.ValidationError({
                    "rent_amount": "مبلغ اجاره الزامی است."
                })

            attrs["price"] = 0
            attrs["deposit_amount"] = None

        # -------- Rent + Mortgage --------
        elif deal_type == Deal.DealType.RENT_MORTGAGE:

            if not deposit:
                raise serializers.ValidationError({
                    "deposit_amount": "مبلغ رهن الزامی است."
                })

            if not rent:
                raise serializers.ValidationError({
                    "rent_amount": "مبلغ اجاره الزامی است."
                })

            attrs["price"] = 0

        # -------- Exchange --------
        elif deal_type == Deal.DealType.EXCHANGE:

            attrs["price"] = 0
            attrs["deposit_amount"] = None
            attrs["rent_amount"] = None

        return attrs

    def validate_commission_amount(self, value):

        if value < 0:
            raise serializers.ValidationError(
                "کارمزد نمی‌تواند منفی باشد."
            )

        return value

    def create(self, validated_data):
        return Deal.objects.create(**validated_data)