from rest_framework import serializers

from crm.models import CustomerPreference


class CustomerPreferenceListSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(source="customer.full_name", read_only=True)

    neighborhoods = serializers.SerializerMethodField()

    class Meta:

        model = CustomerPreference

        fields = (
            "id",
            "customer",
            "customer_name",
            "deal_type",
            "property_type",
            "budget_min",
            "budget_max",
            "area_min",
            "area_max",
            "bedrooms",
            "neighborhoods",
            "notes",
            "created_at",
        )

    def get_neighborhoods(self, obj):

        return [{"id": n.id, "name": n.name} for n in obj.neighborhoods.all()]
