from rest_framework import serializers

from crm.models import Customer


class CustomerListSerializer(serializers.ModelSerializer):

    assigned_agent_name = serializers.CharField(
        source="assigned_agent.full_name", read_only=True
    )
    tags = serializers.SerializerMethodField()

    class Meta:

        model = Customer

        fields = (
            "id",
            "full_name",
            "phone",
            "customer_type",
            "status",
            "assigned_agent_name",
            "source",
            "tags",
            "created_at",
        )

    def get_tags(self, obj):
        return [{"id": t.id, "name": t.name} for t in obj.tags.all()]
