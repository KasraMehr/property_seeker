from django.db import IntegrityError
from rest_framework import serializers

from crm.models import CallLog, Customer
from properties.models import Owner

# from crm.models import Reminder  # TODO: Enable when auto-reminder from call is ready


class CallLogCreateSerializer(serializers.ModelSerializer):

    owner = serializers.PrimaryKeyRelatedField(
        queryset=Owner.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = CallLog

        exclude = (
            "id",
            "agency",
            "is_deleted",
            "handled_by",
            "created_at",
        )

        extra_kwargs = {
            "customer": {"required": False},
        }

    def validate_owner(self, value):

        user = self.context["request"].user

        if value.agency != user.agency:
            raise serializers.ValidationError(
                "مالک متعلق به آژانس شما نیست."
            )

        return value

    def validate_customer(self, value):

        user = self.context["request"].user

        if value.agency != user.agency:
            raise serializers.ValidationError(
                "مشتری متعلق به آژانس شما نیست."
            )

        return value

    def validate(self, attrs):

        owner = attrs.get("owner")

        if owner:
            # مالک را نگه می‌داریم تا در create داخل CallLog ذخیره شود.
            # customer نیز بر اساس شماره تلفن مالک پیدا/ساخته می‌شود.
            attrs["customer"] = self._get_or_create_landlord_customer(owner)

        elif not attrs.get("customer"):
            raise serializers.ValidationError(
                {"customer": "انتخاب مشتری یا مالک الزامی است."}
            )

        return attrs

    def _get_or_create_landlord_customer(self, owner):

        user = self.context["request"].user
        agency = user.agency

        # ابتدا Customer فعال با شماره مالک را پیدا می‌کنیم.
        existing = Customer.objects.filter(
            agency=agency,
            phone=owner.phone,
            is_deleted=False,
        ).order_by("-id")

        # اگر چند Customer با این شماره وجود داشت،
        # ابتدا Customer از نوع LANDLORD را ترجیح می‌دهیم.
        customer = (
            existing.filter(
                customer_type=Customer.CustomerType.LANDLORD
            ).first()
            or existing.first()
        )

        if customer:
            return customer

        # اگر Customer حذف نرم شده وجود دارد، آن را برمی‌گردانیم.
        customer = Customer.objects.filter(
            agency=agency,
            phone=owner.phone,
        ).first()

        if customer:
            customer.is_deleted = False
            customer.save(update_fields=["is_deleted"])
            return customer

        # در غیر این صورت Customer جدید می‌سازیم.
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
            # جلوگیری از خطای race condition در ایجاد Customer
            return Customer.objects.filter(
                agency=agency,
                phone=owner.phone,
            ).first()

    def create(self, validated_data):

        user = self.context["request"].user

        return CallLog.objects.create(
            agency=user.agency,
            handled_by=user,
            **validated_data,
        )

        # TODO: Auto-create Reminder when follow-up date is set
        # next_follow_up_at = validated_data.get("next_follow_up_at")
        # follow_up_done = validated_data.get("follow_up_done", False)
        #
        # if next_follow_up_at and not follow_up_done:
        #     Reminder.objects.create(
        #         agency=user.agency,
        #         user=user,
        #         customer=call.customer,
        #         property=call.property,
        #         title=f"پیگیری تماس: {call.customer.full_name}",
        #         type="call",
        #         description=call.note or "",
        #         due_at=next_follow_up_at,
        #     )