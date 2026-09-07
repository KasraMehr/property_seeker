from rest_framework import serializers

from accounts.serializers.serializers import *
from locations.serializers.address_list import *

from ..models import Property
from .owner_detail import *


class PropertyDetailSerializer(serializers.ModelSerializer):

    owner = serializers.ReadOnlyField(source="owner.full_name")
    phone = serializers.ReadOnlyField(source="owner.phone")

    agent = UserSerializer(read_only=True)

    address = AddressSerializer(read_only=True)

    create_by = UserSerializer(read_only=True)

    agency = serializers.CharField(
        source="agency.name",
        read_only=True,
    )
    divar_neighborhood = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = (
            "id",
            "property_code",
            "owner",
            "phone",
            "agent",
            "address",
            "divar_neighborhood",
            "agency",
            "create_by",
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
            "created_at",
            "updated_at",
        )

    def get_divar_neighborhood(self, obj):
        item = obj.divar_neighborhood
        if not item:
            return None
        return {
            "id": item.id,
            "name": item.name,
            "zone": item.zone_id,
            "zone_name": item.zone.name if item.zone_id else None,
            "city": item.city_id,
            "city_name": item.city.name,
        }
