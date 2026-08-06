from rest_framework import serializers

from crm.models import Customer
from properties.models import Property
from accounts.models import User

from ..models import Reminder



class ReminderCreateSerializer(serializers.ModelSerializer):


    class Meta:

        model = Reminder

        exclude = (

            "id",
            "agency",
            "created_at",
            "updated_at",

        )



    def __init__(self,*args,**kwargs):

        super().__init__(*args,**kwargs)

        request=self.context.get("request")


        if request:

            self.fields["customer"].queryset = Customer.objects.filter(
                agency=request.user.agency
            )


            self.fields["property"].queryset = Property.objects.filter(
                agency=request.user.agency
            )


            self.fields["user"].queryset = User.objects.filter(
                agency=request.user.agency,

            )



    def create(self,validated_data):

        request=self.context["request"]

        return Reminder.objects.create(

            agency=request.user.agency,

            **validated_data

        )