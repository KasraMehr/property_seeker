from rest_framework import serializers

from ..models import Property


class PropertyDetailSerializer(serializers.ModelSerializer):

    owner = serializers.StringRelatedField()#همیشه از متد __str__ مدل.

    agent = serializers.StringRelatedField()

    address = serializers.StringRelatedField()

    create_by = serializers.StringRelatedField()

    class Meta:
        model = Property
        fields = (
            "id",
            "property_code",
            "owner",
            "agent",
            "address",
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