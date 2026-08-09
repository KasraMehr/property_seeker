from rest_framework import serializers

from .models import CallLog


class CallLogDetailSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(source="customer.full_name", read_only=True)

    customer_phone = serializers.CharField(source="customer.phone", read_only=True)

    handled_by_name = serializers.CharField(
        source="handled_by.get_full_name", read_only=True
    )

    property_title = serializers.CharField(
        source="property.title", read_only=True, allow_null=True
    )

    listing_id = serializers.IntegerField(
        source="listing.id", read_only=True, allow_null=True
    )

    call_type_display = serializers.CharField(
        source="get_call_type_display", read_only=True
    )

    result_display = serializers.CharField(source="get_result_display", read_only=True)

    class Meta:
        model = CallLog
        fields = [
            "id",
            "agency",
            "customer",
            "customer_name",
            "customer_phone",
            "property",
            "property_title",
            "listing",
            "listing_id",
            "handled_by",
            "handled_by_name",
            "call_type",
            "call_type_display",
            "result",
            "result_display",
            "note",
            "call_duration",
            "next_follow_up_at",
            "follow_up_done",
            "record_file",
            "called_at",
            "is_deleted",
            "created_at",
        ]
