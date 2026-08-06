from rest_framework import serializers

from crm.models import Customer, Tag

from crm.selectors.agent_selector  import CustomerAgentSelector



from crm.selectors.agent_selector import CustomerAgentSelector



class CustomerUpdateSerializer(serializers.ModelSerializer):


    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        required=False
    )


    class Meta:

        model = Customer

        exclude = (
            "id",
            "agency",
            "created_at",
            "updated_at",
        )


    def update(self,instance,validated_data):


        tags = validated_data.pop(
            "tags",
            None
        )


        for field,value in validated_data.items():

            setattr(
                instance,
                field,
                value
            )


        instance.save()


        if tags is not None:

            instance.tags.set(tags)



        # پیدا کردن دوباره ایجنت
        agent = CustomerAgentSelector.find_agent(
            instance
        )


        if agent:

            instance.assigned_agent = agent
            instance.save()


        return instance