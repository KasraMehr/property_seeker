# serializers/activity_detail.py

from rest_framework import serializers

from audit.models import ActivityLog


class ActivityDetailSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField()

    class Meta:
        model = ActivityLog

        fields = "__all__"