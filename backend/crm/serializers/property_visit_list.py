from rest_framework import serializers

from ..models import PropertyVisit


class PropertyVisitListSerializer(serializers.ModelSerializer):

    property_code = serializers.CharField(source="property.property_code")

    customer_name = serializers.CharField(source="customer.full_name")

    agent_name = serializers.CharField(source="agent.full_name")

    class Meta:

        model = PropertyVisit

        fields = (
            "id",
            "property_code",
            "customer_name",
            "agent_name",
            "visit_date",
            "status",
            "customer_feedback",
        )
