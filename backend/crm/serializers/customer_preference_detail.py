from rest_framework import serializers

from crm.models import CustomerPreference


class CustomerPreferenceDetailSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(source="customer.full_name", read_only=True)

    neighborhoods = serializers.SerializerMethodField()

    class Meta:

        model = CustomerPreference

        fields = "__all__"

    def get_neighborhoods(self, obj):

        return [{"id": n.id, "name": n.name} for n in obj.neighborhoods.all()]
