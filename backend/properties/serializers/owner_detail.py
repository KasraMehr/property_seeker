from rest_framework import serializers

from ..models import Owner


from rest_framework import serializers

from ..models import Property
from accounts.serializers.serializers import *
from locations.serializers.address_list import *

class OwnerPropertySerializer(serializers.ModelSerializer):

    agent = UserSerializer(read_only=True)
    address = AddressSerializer(read_only=True)
    create_by = UserSerializer(read_only=True)

    agency = serializers.CharField(
        source="agency.name",
        read_only=True,
    )

    class Meta:
        model = Property
        fields = (
            "id",
            "property_code",

            "agent",
            "address",
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

class OwnerDetailSerializer(serializers.ModelSerializer):

    properties_count = serializers.IntegerField(
        read_only=True
    )

    properties = OwnerPropertySerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Owner
        fields = (
            "id",
            "full_name",
            "phone",
            "alternate_phone",
            "national_id",
            "notes",
            "properties_count",
            "created_at",
            "updated_at",
            "created_by",
            "properties",
        )