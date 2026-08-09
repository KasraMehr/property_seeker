from rest_framework import serializers

from crm.models import Customer, Tag


class CustomerCreateSerializer(serializers.ModelSerializer):

    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, required=False
    )

    class Meta:

        model = Customer

        exclude = (
            "id",
            "agency",
            "created_at",
            "updated_at",
        )

    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request:

            self.fields["tags"].queryset = Tag.objects.filter(
                agency=request.user.agency
            )

    def validate_phone(self, value):

        user = self.context["request"].user

        if Customer.objects.filter(agency=user.agency, phone=value).exists():

            raise serializers.ValidationError(
                "این شماره تلفن قبلا در آژانس ثبت شده است."
            )

        return value

    def validate_assigned_agent(self, value):

        user = self.context["request"].user

        if value.agency != user.agency:

            raise serializers.ValidationError("این کاربر متعلق به آژانس شما نیست.")

        return value

    def create(self, validated_data):

        user = self.context["request"].user

        tags = validated_data.pop("tags", [])

        customer = Customer.objects.create(agency=user.agency, **validated_data)

        customer.tags.set(tags)

        return customer
