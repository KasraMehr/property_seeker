from rest_framework import serializers

from ..models import Property


class PropertyListSerializer(serializers.ModelSerializer):

    owner = serializers.CharField(
        source="owner.full_name",
        read_only=True
    )

    agent = serializers.CharField(
        source="agent.full_name",
        read_only=True
    )

    city = serializers.CharField(
        source="address.city.name",
        read_only=True
    )

    created_by = serializers.CharField( source="create_by.full_name",
        read_only=True)
    agency = serializers.CharField(
        source="agency.name",
        read_only=True,
    )

    class Meta:
        model = Property
        fields = (
            "id",
            "agency",
            "property_code",
            "title",
            "owner",
            "agent",
            "created_by",
            "city",
            "property_type",
            "deal_type",
            "area",
            "sale_price",
            "monthly_rent",
            "status",
        )