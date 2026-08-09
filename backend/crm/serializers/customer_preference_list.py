from rest_framework import serializers

from crm.models import CustomerPreference


class CustomerPreferenceListSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(source="customer.full_name", read_only=True)

    class Meta:

        model = CustomerPreference

        fields = (
            "id",
            "customer_name",
            "deal_type",
            "property_type",
            "budget_min",
            "budget_max",
            "area_min",
            "area_max",
            "bedrooms",
            "created_at",
        )
