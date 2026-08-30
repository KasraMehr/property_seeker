from rest_framework import serializers

from crm.models import Customer


class CustomerDetailSerializer(serializers.ModelSerializer):

    assigned_agent_name = serializers.CharField(
        source="assigned_agent.full_name", read_only=True
    )
    calls_count = serializers.SerializerMethodField()
    visits_count = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:

        model = Customer

        fields = "__all__"

    def get_calls_count(self, obj):
        return obj.calls.count()

    def get_visits_count(self, obj):
        return obj.visits.count()

    def get_tags(self, obj):
        return [{"id": t.id, "name": t.name} for t in obj.tags.all()]
