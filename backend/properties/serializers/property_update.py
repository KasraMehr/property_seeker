from rest_framework import serializers

from ..models import Property



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
        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()

        return instance