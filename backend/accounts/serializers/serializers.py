from django.contrib.auth.models import Permission
from rest_framework import serializers

from accounts.models import Agency, Role, User
from locations.models import District, DivarNeighborhood


class DivarNeighborhoodSimpleSerializer(serializers.ModelSerializer):
    zone = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )
    zone_name = serializers.CharField(
        source="zone.name",
        read_only=True,
    )
    city = serializers.PrimaryKeyRelatedField(
        read_only=True,
    )
    city_name = serializers.CharField(
        source="city.name",
        read_only=True,
    )

    class Meta:
        model = DivarNeighborhood
        fields = (
            "id",
            "name",
            "zone",
            "zone_name",
            "city",
            "city_name",
        )


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

        if (
            Agency.objects
            .exclude(id=agency.id)
            .filter(name=value)
            .exists()
        ):
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
            name=value,
        ).exists():
            raise serializers.ValidationError(
                "این نقش قبلاً ثبت شده است."
            )

        return value

    def create(self, validated_data):
        permissions = validated_data.pop("permissions", [])

        role = Role.objects.create(**validated_data)
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

        if (
            Role.objects
            .exclude(id=self.instance.id)
            .filter(
                agency=agency,
                name=value,
            )
            .exists()
        ):
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

    role = RoleSerializer(
        read_only=True,
        many=True,
    )

    service_neighborhoods = DivarNeighborhoodSimpleSerializer(
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
            "service_neighborhoods",
            "is_owner",
            "is_active",
            "deal_type_scope",
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

    service_neighborhoods = serializers.PrimaryKeyRelatedField(
        queryset=DivarNeighborhood.objects.filter(
            active=True,
        ),
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
            "service_neighborhoods",
        )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request:
            self.fields["role"].queryset = Role.objects.filter(
                agency=request.user.agency,
            )

    def validate_role(self, value):
        if value.agency != self.context["request"].user.agency:
            raise serializers.ValidationError(
                "این نقش متعلق به آژانس شما نیست."
            )

        return value

    def validate_service_neighborhoods(self, value):
        """
        محله‌های انتخاب‌شده باید فعال باشند.
        """
        inactive = [
            neighborhood.name
            for neighborhood in value
            if not neighborhood.active
        ]

        if inactive:
            raise serializers.ValidationError(
                "محله‌های غیرفعال قابل انتخاب نیستند."
            )

        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        neighborhoods = validated_data.pop(
            "service_neighborhoods",
            [],
        )

        owner = self.context["request"].user

        user = User.objects.create_user(
            agency=owner.agency,
            password=password,
            **validated_data,
        )

        user.service_neighborhoods.set(neighborhoods)

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

    service_neighborhoods = serializers.PrimaryKeyRelatedField(
        queryset=DivarNeighborhood.objects.filter(
            active=True,
        ),
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
            "is_owner",
            "service_neighborhoods",
        )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request:
            self.fields["role"].queryset = Role.objects.filter(
                agency=request.user.agency,
            )

    def validate_role(self, value):
        if value.agency != self.context["request"].user.agency:
            raise serializers.ValidationError(
                "این نقش متعلق به آژانس شما نیست."
            )

        return value

    def validate_service_neighborhoods(self, value):
        inactive = [
            neighborhood.name
            for neighborhood in value
            if not neighborhood.active
        ]

        if inactive:
            raise serializers.ValidationError(
                "محله‌های غیرفعال قابل انتخاب نیستند."
            )

        return value

    def update(self, instance, validated_data):

        password = validated_data.pop(
            "password",
            None,
        )

        role = validated_data.pop(
            "role",
            None,
        )

        neighborhoods = validated_data.pop(
            "service_neighborhoods",
            None,
        )

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        # M2M fields must be set after save()
        if role is not None:
            instance.role.set([role])

        if neighborhoods is not None:
            instance.service_neighborhoods.set(neighborhoods)

        return instance


class PermissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Permission
        fields = (
            "id",
            "name",
            "codename",
        )