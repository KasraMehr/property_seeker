from rest_framework import serializers

from crm.models import Customer



class CustomerDetailSerializer(serializers.ModelSerializer):


    assigned_agent_name = serializers.CharField(
        source="assigned_agent.full_name",
        read_only=True
    )


    class Meta:

        model = Customer

        fields = "__all__"