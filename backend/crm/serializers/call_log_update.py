from django.db import IntegrityError
from rest_framework import serializers

from crm.models import CallLog, Customer
from properties.models import Owner


class CallLogUpdateSerializer(serializers.ModelSerializer):

    owner = serializers.PrimaryKeyRelatedField(
        queryset=Owner.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = CallLog

        exclude = (
            "id",
            "agency",
            "handled_by",
            "created_at",
            "is_deleted",
        )

        extra_kwargs = {
            field: {"required": False}
            for field in [
                "customer",
                "property",
                "listing",
                "call_type",
                "result",
                "note",
                "call_duration",
                "next_follow_up_at",
                "follow_up_done",
                "record_file",
                "called_at",
            ]
        }

    def validate_owner(self, value):

        if value is None:
            return value

        user = self.context["request"].user

        if value.agency != user.agency:
            raise serializers.ValidationError(
                "مالک متعلق به آژانس شما نیست."
            )

        return value

    def validate_customer(self, value):

        if value is None:
            return value

        user = self.context["request"].user

        if value.agency != user.agency:
            raise serializers.ValidationError(
                "مشتری متعلق به آژانس شما نیست."
            )

        return value

    def validate(self, attrs):

        owner = attrs.get("owner")

        # اگر owner ارسال شده باشد، customer متناظر با مالک
        # پیدا یا ایجاد می‌شود.
        if owner:
            attrs["customer"] = self._get_or_create_landlord_customer(owner)

        return attrs

    def _get_or_create_landlord_customer(self, owner):

        user = self.context["request"].user
        agency = user.agency

        existing = Customer.objects.filter(
            agency=agency,
            phone=owner.phone,
            is_deleted=False,
        ).order_by("-id")

        customer = (
            existing.filter(
                customer_type=Customer.CustomerType.LANDLORD
            ).first()
            or existing.first()
        )

        if customer:
            return customer

        # اگر Customer قبلاً soft-delete شده باشد
        customer = Customer.objects.filter(
            agency=agency,
            phone=owner.phone,
        ).first()

        if customer:
            customer.is_deleted = False
            customer.save(update_fields=["is_deleted"])
            return customer

        try:
            return Customer.objects.create(
                agency=agency,
                full_name=owner.full_name,
                phone=owner.phone,
                customer_type=Customer.CustomerType.LANDLORD,
                status=Customer.Status.NEW,
                source="owner",
                notes=f"ساخته شده از مالک (شناسه: {owner.id})",
                assigned_agent=user,
            )

        except IntegrityError:
            return Customer.objects.filter(
                agency=agency,
                phone=owner.phone,
            ).first()