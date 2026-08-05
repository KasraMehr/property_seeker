from rest_framework import serializers

from ..models import PropertyVisit



class PropertyVisitDetailSerializer(serializers.ModelSerializer):


    property_code = serializers.CharField(
        source="property.property_code",
        read_only=True
    )


    property_title = serializers.CharField(
        source="property.title",
        read_only=True
    )


    customer_name = serializers.CharField(
        source="customer.full_name",
        read_only=True
    )


    customer_phone = serializers.CharField(
        source="customer.phone",
        read_only=True
    )


    agent_name = serializers.CharField(
        source="agent.full_name",
        read_only=True
    )


    created_by_name = serializers.CharField(
        source="created_by.full_name",
        read_only=True
    )


    class Meta:

        model = PropertyVisit

        fields = (

            "id",

            "property",
            "property_code",
            "property_title",

            "customer",
            "customer_name",
            "customer_phone",

            "agent",
            "agent_name",

            "visit_date",
            "end_date",

            "status",

            "customer_feedback",
            "cancel_reason",

            "created_by_name",

            "created_at",
            "updated_at",
        )