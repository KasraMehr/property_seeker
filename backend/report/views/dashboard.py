from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Role, User
from accounts.permissions import IsAgencyOwner
from crm.models import Customer
from properties.models import Property


class DashboardView(APIView):
    permission_classes = (IsAgencyOwner,)

    def get(self, request):
        agency = getattr(request.user, "agency", None)
        if agency is None:
            return Response(
                {
                    "customers_count": 0,
                    "employees_count": 0,
                    "properties_count": 0,
                    "roles_count": 0,
                    "recent_properties": [],
                },
                status=400,
            )

        recent_properties = list(
            Property.objects.filter(agency=agency)
            .order_by("-created_at")[:5]
            .values("id", "title", "property_code", "status", "created_at")
        )

        return Response(
            {
                "customers_count": Customer.objects.filter(
                    agency=agency, is_deleted=False
                ).count(),
                "employees_count": User.objects.filter(agency=agency).count(),
                "properties_count": Property.objects.filter(agency=agency).count(),
                "roles_count": Role.objects.filter(agency=agency).count(),
                "recent_properties": recent_properties,
            }
        )