from rest_framework import serializers
from ..models import *
from accounts.models import User
from locations.models import *


from django.contrib.auth.models import Permission
from rest_framework import serializers
from ..models import Agency, Role
from accounts.models import User
from locations.models import District


class AgencySerializer(serializers.ModelSerializer):

    class Meta:
        model = Agency
        fields = (
            "id",
            "name",
            "phone",
            "address",
        )

class AgencyCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Agency
        fields = (
            "name",
            "phone",
            "address",
        )

    def validate_name(self, value):

        if Agency.objects.filter(name=value).exists():
            raise serializers.ValidationError(
                "این آژانس قبلاً ثبت شده است."
            )

        return value

class AgencyUpdateSerializer(serializers.ModelSerializer):

    name = serializers.CharField(required=False)
    phone = serializers.CharField(required=False)
    address = serializers.CharField(required=False)

    class Meta:
        model = Agency
        fields = (
            "name",
            "phone",
            "address",
        )

    def validate_name(self, value):

        agency = self.instance

        if Agency.objects.exclude(id=agency.id).filter(name=value).exists():
            raise serializers.ValidationError(
                "این نام قبلاً ثبت شده است."
            )

        return value

    def update(self, instance, validated_data):

        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.save()

        return instance

class RoleCreateSerializer(serializers.ModelSerializer):

    permissions = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Permission.objects.all(),
    )

    class Meta:
        model = Role
        fields = (
            "name",
            "description",
            "permissions",
        )

    def validate_name(self, value):

        agency = self.context["request"].user.agency

        if Role.objects.filter(
            agency=agency,
            name=value
        ).exists():
            raise serializers.ValidationError(
                "این نقش قبلاً ثبت شده است."
            )

        return value

    def create(self, validated_data):

        permissions = validated_data.pop(
            "permissions",
            []
        )

        role = Role.objects.create(
            **validated_data
        )

        role.permissions.set(permissions)

        return role



class RoleUpdateSerializer(serializers.ModelSerializer):

    permissions = serializers.PrimaryKeyRelatedField(
        queryset=Permission.objects.all(),
        many=True,
        required=False,
    )

    name = serializers.CharField(required=False)
    description = serializers.CharField(required=False)

    class Meta:
        model = Role
        fields = (
            "name",
            "description",
            "permissions",
        )

    def validate_name(self, value):

        agency = self.context["request"].user.agency

        if Role.objects.exclude(
            id=self.instance.id
        ).filter(
            agency=agency,
            name=value
        ).exists():

            raise serializers.ValidationError(
                "این نقش قبلاً ثبت شده است."
            )

        return value

    def update(self, instance, validated_data):

        permissions = validated_data.pop(
            "permissions",
            None,
        )

        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.save()

        if permissions is not None:
            instance.permissions.set(permissions)

        return instance

class RoleSerializer(serializers.ModelSerializer):

    permissions = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field="codename",
    )

    class Meta:
        model = Role
        fields = (
            "id",
            "name",
            "description",
            "permissions",
        )


class DistrictSimpleSerializer(serializers.ModelSerializer):

    class Meta:
        model = District
        fields = (
            "id",
            "name",
        )


class UserSerializer(serializers.ModelSerializer):

    agency = AgencySerializer(read_only=True)
    role = RoleSerializer(read_only=True,many=True)
    service_districts = DistrictSimpleSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = User
        fields = (
            "id",
            "full_name",
            "phone",
            "national_id",
            "agency",
            "role",
            "service_districts",
            "is_owner",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "agency",
            "created_at",
            "updated_at",
        )


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    role = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.none(),
    )

    service_districts = serializers.PrimaryKeyRelatedField(
        queryset=District.objects.all(),
        many=True,
        required=False,
    )

    class Meta:
        model = User
        fields = (
            "full_name",
            "phone",
            "national_id",
            "role",
            "password",
            "service_districts",
        )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")
        if request:
            self.fields["role"].queryset = Role.objects.filter(
                agency=request.user.agency
            )

    def validate_role(self, value):
        if value.agency != self.context["request"].user.agency:
            raise serializers.ValidationError(
                "این نقش متعلق به آژانس شما نیست."
            )
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        districts = validated_data.pop("service_districts", [])

        owner = self.context["request"].user

        user = User.objects.create_user(
            agency=owner.agency,
            is_owner=False,
            password=password,
            **validated_data
        )

        user.service_districts.set(districts)

        return user

class UserUpdateSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        required=False,
        write_only=True,
    )

    role = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.none(),
        required=False,
    )

    service_districts = serializers.PrimaryKeyRelatedField(
        queryset=District.objects.all(),
        many=True,
        required=False,
    )
    full_name = serializers.CharField(required=False)
    national_id = serializers.CharField(required=False)
    is_owner = serializers.BooleanField(required=False)

    class Meta:
        model = User
        fields = (
            "full_name",
            "phone",
            "national_id",
            "role",
            "password",
            "is_active",
            "service_districts",
        )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")
        if request:
            self.fields["role"].queryset = Role.objects.filter(
                agency=request.user.agency
            )

    def validate_role(self, value):
        if value.agency != self.context["request"].user.agency:
            raise serializers.ValidationError(
                "این نقش متعلق به آژانس شما نیست."
            )
        return value

    def update(self, instance, validated_data):

        password = validated_data.pop("password", None)
        districts = validated_data.pop("service_districts", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        if districts is not None:
            instance.service_districts.set(districts)

        return instance


from django.contrib.auth.models import Permission


class PermissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Permission
        fields = (
            "id",
            "name",
            "codename",
        )