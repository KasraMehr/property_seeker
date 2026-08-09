from rest_framework import serializers

from accounts.serializers.serializers import *
from properties.models import PropertyStatusHistory

from ..serializers.property_detail import *


class PropertyStatusHistoryDetailSerializer(serializers.ModelSerializer):

    property_code = PropertyDetailSerializer(read_only=True)
    changed_by = UserSerializer(read_only=True)

    class Meta:
        model = PropertyStatusHistory
        fields = (
            "id",
            "property",
            "property_code",
            "old_status",
            "new_status",
            "changed_by",
            "created_at",
        )
