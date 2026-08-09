from django.db.models import Sum
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Role, User
from accounts.permissions import IsAgencyOwner
from crm.models import Customer
from deals.models import Deal
from properties.models import Property


class DashboardView(APIView):

    permission_classes = (IsAgencyOwner,)

    def get(self, request):

        agency = request.user.agency

        recent_properties = (
            Property.objects.filter(agency=agency)
            .order_by("-created_at")[:5]
            .values(
                "id",
                "title",
                "property_code",
                "status",
                "created_at",
            )
        )

        recent_deals = (
            Deal.objects.filter(agency=agency)
            .order_by("-created_at")[:5]
            .values(
                "id",
                "deal_number",
                "price",
                "status",
                "created_at",
            )
        )

        data = {
            "customers_count": Customer.objects.filter(
                agency=agency, is_deleted=False
            ).count(),
            "employees_count": User.objects.filter(agency=agency).count(),
            "properties_count": Property.objects.filter(agency=agency).count(),
            "deals_count": Deal.objects.filter(agency=agency, is_deleted=False).count(),
            "roles_count": Role.objects.filter(agency=agency).count(),
            "commission": Deal.objects.filter(
                agency=agency, status=Deal.Status.CONTRACTED
            ).aggregate(total=Sum("commission_amount"))["total"]
            or 0,
            "recent_properties": recent_properties,
            "recent_deals": recent_deals,
        }

        return Response(data)
