from rest_framework import serializers
from ..models import *
class AgencySerializer(serializers.ModelSerializer):

    class Meta:
        model = Agency
        fields = "__all__"

class RoleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Role
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):

    agency  = AgencySerializer(read_only=True)
    role = RoleSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "full_name",
            "phone",
            "national_id",
            "agency",
            "role",
            "is_owner",
            "is_active",
            "created_at",
            "updated_at",
        )


from rest_framework import serializers
from accounts.models import User


class UserCreateSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )


    class Meta:
        model = User
        fields = (
            "full_name",
            "phone",
            "national_id",
            "role",
            "password",
        )

    def create(self, validated_data):

        password = validated_data.pop("password")

        owner = self.context["request"].user

        user = User.objects.create_user(
            agency=owner.agency,
            is_owner=False,
            password=password,
            **validated_data
        )

        return user


from rest_framework import serializers
from accounts.models import User


class UserUpdateSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        required=False,
        write_only=True
    )

    class Meta:
        model = User
        fields = (
            "full_name",
            "phone",
            "national_id",
            "role",
            "password",
            "is_active",
        )

    def update(self, instance, validated_data):

        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        return instance