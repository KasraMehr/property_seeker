from rest_framework import serializers

from crm.models import Customer
from properties.models import Property
from accounts.models import User

from ..models import PropertyVisit



class PropertyVisitCreateSerializer(serializers.ModelSerializer):


    class Meta:

        model = PropertyVisit

        exclude = (
            "id",
            "agency",
            "created_by",
            "created_at",
            "updated_at",
        )


    def __init__(self,*args,**kwargs):

        super().__init__(*args,**kwargs)


        request = self.context.get(
            "request"
        )


        if request:

            self.fields["property"].queryset = Property.objects.filter(
                agency=request.user.agency
            )


            self.fields["customer"].queryset = Customer.objects.filter(
                agency=request.user.agency
            )


            self.fields["agent"].queryset = User.objects.filter(
                agency=request.user.agency,
                is_active=True
            )


    def validate(self,attrs):

        request = self.context["request"]


        property = attrs["property"]

        customer = attrs["customer"]

        agent = attrs["agent"]



        if property.agency != request.user.agency:

            raise serializers.ValidationError(
                "این ملک متعلق به آژانس شما نیست."
            )


        if customer.agency != request.user.agency:

            raise serializers.ValidationError(
                "این مشتری متعلق به آژانس شما نیست."
            )


        if agent.agency != request.user.agency:

            raise serializers.ValidationError(
                "این ایجنت متعلق به آژانس شما نیست."
            )


        return attrs



    def create(self,validated_data):

        user = self.context["request"].user


        return PropertyVisit.objects.create(
            agency=user.agency,
            created_by=user,
            **validated_data
        )