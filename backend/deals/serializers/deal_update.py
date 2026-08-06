from rest_framework import serializers

from deals.models import Deal


class DealUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Deal

        fields = (
            "deal_type",
            "price",
            "deposit_amount",
            "rent_amount",
            "commission_amount",
            "status",
            "deal_date",
            "closed_at",
            "notes",
            "agent",
        )

        extra_kwargs = {

            "deal_type": {
                "required": False,
            },

            "price": {
                "required": False,
            },

            "deposit_amount": {
                "required": False,
                "allow_null": True,
            },

            "rent_amount": {
                "required": False,
                "allow_null": True,
            },

            "commission_amount": {
                "required": False,
            },

            "status": {
                "required": False,
            },

            "deal_date": {
                "required": False,
            },

            "closed_at": {
                "required": False,
                "allow_null": True,
            },

            "notes": {
                "required": False,
                "allow_blank": True,
            },

            "agent": {
                "required": False,
            },
        }


    def update(self, instance, validated_data):

        user = self.context["request"].user


        for field, value in validated_data.items():

            setattr(
                instance,
                field,
                value
            )


        instance.updated_by = user

        instance.save()

        return instance