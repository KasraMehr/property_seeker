from rest_framework import serializers

from deals.models import Deal


class DealUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Deal
        fields = (
            "status",
            "price",
            "deposit_amount",
            "rent_amount",
            "commission_amount",
            "deal_date",
            "notes",
            "agent",
            "notes"
        )

    def validate(self, attrs):

        deal = self.instance

        deal_type = deal.deal_type

        price = attrs.get("price", deal.price)
        deposit = attrs.get("deposit_amount", deal.deposit_amount)
        rent = attrs.get("rent_amount", deal.rent_amount)

        if deal_type == Deal.DealType.SALE:

            if not price:
                raise serializers.ValidationError(
                    {
                        "price": "قیمت فروش الزامی است."
                    }
                )

        elif deal_type == Deal.DealType.MORTGAGE:

            if not deposit:
                raise serializers.ValidationError(
                    {
                        "deposit_amount": "مبلغ رهن الزامی است."
                    }
                )

        elif deal_type == Deal.DealType.RENT:

            if not rent:
                raise serializers.ValidationError(
                    {
                        "rent_amount": "مبلغ اجاره الزامی است."
                    }
                )

        elif deal_type == Deal.DealType.RENT_MORTGAGE:

            if not deposit:
                raise serializers.ValidationError(
                    {
                        "deposit_amount": "مبلغ رهن الزامی است."
                    }
                )

            if not rent:
                raise serializers.ValidationError(
                    {
                        "rent_amount": "مبلغ اجاره الزامی است."
                    }
                )

        return attrs

    def update(self, instance, validated_data):

        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.save()

        return instance