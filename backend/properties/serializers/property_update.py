from rest_framework import serializers

from ..models import *

from .baseSerializers import BasePropertySerializer
from ..models import (
    Property,
    PropertyHistory,
    PropertyStatusHistory,
)


class PropertyUpdateSerializer(BasePropertySerializer):

    class Meta:
        model = Property

        exclude = (
            "id",
            "agency",
            "create_by",
            "property_code",
            "created_at",
            "updated_at",
        )

        extra_kwargs = {
            field: {
                "required": False
            }
            for field in (
                "owner",
                "agent",
                "address",
                "title",
                "property_type",
                "deal_type",
                "area",
                "floor",
                "total_floors",
                "age",
                "bedrooms",
                "bathrooms",
                "parking_count",
                "storage_count",
                "orientation",
                "condition",
                "description",
                "price_per_meter",
                "sale_price",
                "mortgage_amount",
                "deposit_amount",
                "monthly_rent",
                "status",
            )
        }

    def update(self, instance, validated_data):

        user = self.context["request"].user

        for field, new_value in validated_data.items():

            old_value = getattr(instance, field)

            if old_value != new_value:

                PropertyHistory.objects.create(
                    property=instance,
                    action=PropertyHistory.Action.UPDATE,
                    field_name=field,
                    old_value=str(old_value),
                    new_value=str(new_value),
                    changed_by=user,
                )

                if field == "status":

                    PropertyStatusHistory.objects.create(
                        property=instance,
                        old_status=old_value,
                        new_status=new_value,
                        changed_by=user,
                    )

            setattr(instance, field, new_value)

        instance.save()

        return instance