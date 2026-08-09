from rest_framework import serializers

from crm.models import CustomerPreference
from crm.selectors.agent_selector import *
from locations.models import Neighborhood


class CustomerPreferenceUpdateSerializer(serializers.ModelSerializer):

    neighborhoods = serializers.PrimaryKeyRelatedField(
        queryset=Neighborhood.objects.all(), many=True, required=False
    )

    class Meta:

        model = CustomerPreference

        exclude = (
            "id",
            "created_at",
        )

        extra_kwargs = {
            "customer": {"required": False},
            "deal_type": {"required": False},
            "property_type": {"required": False},
            "budget_min": {"required": False},
            "budget_max": {"required": False},
            "area_min": {"required": False},
            "area_max": {"required": False},
            "bedrooms": {"required": False},
            "notes": {"required": False},
        }

    def update(self, instance, validated_data):

        neighborhoods = validated_data.pop("neighborhoods", None)

        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()

        if neighborhoods is not None:
            instance.neighborhoods.set(neighborhoods)

        customer = instance.customer

        agent = CustomerAgentSelector.find_agent(customer)

        if agent:
            customer.assigned_agent = agent
            customer.save()

        return instance
