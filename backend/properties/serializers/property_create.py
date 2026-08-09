from properties.models import Property, PropertyHistory

from ..models import Property, PropertyHistory
from .baseSerializers import BasePropertySerializer


class PropertyCreateSerializer(BasePropertySerializer):

    class Meta:
        model = Property

        exclude = (
            "id",
            "property_code",
            "agency",
            "create_by",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):

        user = self.context["request"].user

        property = Property.objects.create(
            agency=user.agency, create_by=user, **validated_data
        )

        PropertyHistory.objects.create(
            property=property,
            action=PropertyHistory.Action.CREATE,
            field_name="",
            old_value="",
            new_value=property.property_code,
            changed_by=user,
        )

        return property
