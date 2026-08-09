from rest_framework import serializers

from properties.models import PropertyStatusHistory
from ..serializers.property_detail import *
from accounts.serializers.serializers import *

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