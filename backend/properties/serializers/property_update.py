from rest_framework import serializers

from ..models import *



class PropertyUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Property
        exclude = (
            "id",
            "property_code",
            "created_at",
            "updated_at",
        )

        extra_kwargs = {
            "owner": {"required": False, },
            "agent": {"required": False,  },
            "address": {"required": False,  },

            "title": {"required": False},

            "property_type": {
                "required": False,
                "allow_blank": True,

            },

            "deal_type": {"required": False},

            "area": {"required": False},
            "floor": {"required": False,  },
            "total_floors": {"required": False,  },

            "age": {"required": False},
            "bedrooms": {"required": False},
            "bathrooms": {"required": False},
            "parking_count": {"required": False},
            "storage_count": {"required": False},

            "orientation": {
                "required": False,
                "allow_blank": True,
            },

            "condition": {
                "required": False,
                "allow_blank": True,
            },

            "description": {
                "required": False,
                "allow_blank": True,
            },

            "price_per_meter": {
                "required": False,

            },

            "sale_price": {
                "required": False,

            },

            "mortgage_amount": {
                "required": False,

            },

            "deposit_amount": {
                "required": False,

            },

            "monthly_rent": {
                "required": False
            },

            "status": {"required": False}
        }

    def update(self, instance, validated_data):
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