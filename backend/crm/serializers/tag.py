from rest_framework import serializers
from crm.models import Tag


class TagSerializer(serializers.ModelSerializer):

    class Meta:

        model = Tag

        fields = (
            "id",
            "name",
        )



from rest_framework import serializers

from crm.models import Tag



class TagCreateSerializer(serializers.ModelSerializer):


    class Meta:

        model = Tag

        fields = (
            "name",
        )


    def validate_name(self,value):

        user = self.context["request"].user


        if Tag.objects.filter(
            agency=user.agency,
            name=value
        ).exists():

            raise serializers.ValidationError(
                "این تگ قبلا در آژانس ثبت شده است."
            )


        return value



    def create(self,validated_data):

        user = self.context["request"].user


        return Tag.objects.create(
            agency=user.agency,
            **validated_data
        )


from rest_framework import serializers

from crm.models import Tag



class TagUpdateSerializer(serializers.ModelSerializer):


    class Meta:

        model = Tag

        fields = (
            "name",
        )


        extra_kwargs = {

            "name":{
                "required":False
            }

        }



    def validate_name(self,value):

        user = self.context["request"].user


        if Tag.objects.filter(
            agency=user.agency,
            name=value
        ).exclude(
            id=self.instance.id
        ).exists():

            raise serializers.ValidationError(
                "این تگ قبلا وجود دارد."
            )


        return value