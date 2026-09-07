from rest_framework import serializers

from ..models import Property


class PropertyListSerializer(serializers.ModelSerializer):

    owner = serializers.CharField(source="owner.full_name", read_only=True)

    agent = serializers.CharField(source="agent.full_name", read_only=True)

    city = serializers.SerializerMethodField()

    created_by = serializers.CharField(source="create_by.full_name", read_only=True)
    agency = serializers.CharField(
        source="agency.name",
        read_only=True,
    )
    zone = serializers.CharField(
        source="divar_neighborhood.zone.name", read_only=True, allow_null=True
    )

    def get_city(self, obj):
        # شهر از آدرس داخلی، و در نبود آن از محلهٔ دیوار
        if obj.address_id and obj.address.neighborhood_id:
            return obj.address.neighborhood.district.city.name
        if obj.divar_neighborhood_id and obj.divar_neighborhood.city_id:
            return obj.divar_neighborhood.city.name
        return None

    #divar_neighborhood_name = serializers.CharField(
     #   source="divar_neighborhood.name", read_only=True, allow_null=True
    #)

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
            "zone",
            "property_type",
            "deal_type",
            "area",
            "sale_price",
            "monthly_rent",
            "status",
            "created_at",
            "updated_at",
        )
