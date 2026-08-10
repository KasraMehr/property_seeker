# serializers/activity_list.py

from rest_framework import serializers

from audit.models import ActivityLog


class ActivityListSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField()

    class Meta:
        model = ActivityLog

        fields = (
            "id",
            "user",
            "action",
            "entity_type",
            "entity_id",
            "level",
            "created_at",
        )
