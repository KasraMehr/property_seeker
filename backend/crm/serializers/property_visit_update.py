from rest_framework import serializers

from accounts.models import User
from crm.models import Customer
from properties.models import Property

from ..models import PropertyVisit


class PropertyVisitUpdateSerializer(serializers.ModelSerializer):

    class Meta:

        model = PropertyVisit

        exclude = (
            "id",
            "agency",
            "created_by",
            "created_at",
            "updated_at",
        )

        extra_kwargs = {
            "property": {"required": False},
            "customer": {"required": False},
            "agent": {"required": False},
            "visit_date": {"required": False},
            "end_date": {"required": False},
            "status": {"required": False},
            "customer_feedback": {"required": False},
            "cancel_reason": {"required": False},
        }

    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request:

            self.fields["property"].queryset = Property.objects.filter(
                agency=request.user.agency
            )

            self.fields["customer"].queryset = Customer.objects.filter(
                agency=request.user.agency
            )

            self.fields["agent"].queryset = User.objects.filter(
                agency=request.user.agency, is_active=True
            )

    def validate(self, attrs):

        request = self.context["request"]

        property = attrs.get("property", self.instance.property)

        customer = attrs.get("customer", self.instance.customer)

        agent = attrs.get("agent", self.instance.agent)

        if property.agency != request.user.agency:

            raise serializers.ValidationError(
                {"property": "این ملک متعلق به آژانس شما نیست."}
            )

        if customer.agency != request.user.agency:

            raise serializers.ValidationError(
                {"customer": "این مشتری متعلق به آژانس شما نیست."}
            )

        if agent.agency != request.user.agency:

            raise serializers.ValidationError(
                {"agent": "این ایجنت متعلق به آژانس شما نیست."}
            )

        return attrs

    def update(self, instance, validated_data):

        for field, value in validated_data.items():

            setattr(instance, field, value)

        instance.save()

        return instance
