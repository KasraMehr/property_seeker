from rest_framework import serializers

from ..models import Customer


class CustomerCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = (
            "full_name",
            "phone",
            "alternate_phone",
            "customer_type",
            "notes",
            #"assigned_agent",
        )

    def create(self, validated_data):
        return Customer.objects.create(**validated_data)
