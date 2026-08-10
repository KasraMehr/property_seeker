from rest_framework import serializers

from crm.models import Customer, CustomerPreference
from locations.models import Neighborhood

from ..selectors.agent_selector import CustomerAgentSelector


class CustomerPreferenceCreateSerializer(serializers.ModelSerializer):

    neighborhoods = serializers.PrimaryKeyRelatedField(
        queryset=Neighborhood.objects.all(), many=True, required=False
    )

    class Meta:

        model = CustomerPreference

        exclude = (
            "id",
            "created_at",
        )

    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request:

            self.fields["customer"].queryset = Customer.objects.filter(
                agency=request.user.agency
            )

    def validate_customer(self, value):

        request = self.context["request"]

        if value.agency != request.user.agency:
            raise serializers.ValidationError("این مشتری متعلق به آژانس شما نیست.")

        return value

    def create(self, validated_data):

        neighborhoods = validated_data.pop("neighborhoods", [])

        preference = CustomerPreference.objects.create(**validated_data)

        preference.neighborhoods.set(neighborhoods)

        # تعیین ایجنت
        customer = preference.customer

        agent = CustomerAgentSelector.find_agent(customer)

        if agent:

            customer.assigned_agent = agent
            customer.save()

        return preference
