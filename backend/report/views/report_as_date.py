from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response

from deals.models import Deal
from properties.models import *
from deals.models import *
from accounts.permissions import IsAgencyOwner


class StatisticsReportView(APIView):

    permission_classes = (
        IsAgencyOwner,
    )

    def get(self, request):

        start = request.GET.get("start")
        end = request.GET.get("end")

        agency = request.user.agency

        deals = Deal.objects.filter(
            agency=agency,
            deal_date__date__range=[start, end]
        )

        return Response({

            "deals_count": deals.count(),

            "closed_count":
                deals.filter(
                    status=Deal.Status.CONTRACTED
                ).count(),

            "cancel_count":
                deals.filter(
                    status=Deal.Status.CANCELED
                ).count(),

            "commission":
                deals.aggregate(
                    total=Sum(
                        "commission_amount"
                    )
                )["total"] or 0,
        })

class PropertyReportView(APIView):

    permission_classes = (
        IsAgencyOwner,
    )

    def get(self, request):

        agency = request.user.agency

        return Response({

            "sale":

                Property.objects.filter(

                    agency=agency,

                    deal_type=Property.DealType.SALE

                ).count(),

            "rent":

                Property.objects.filter(

                    agency=agency,

                    deal_type=Property.DealType.RENT

                ).count(),

            "sold":

                Property.objects.filter(

                    agency=agency,

                    status=Property.Status.SOLD

                ).count(),

            "rented":

                Property.objects.filter(

                    agency=agency,

                    status=Property.Status.RENTED

                ).count(),
        })

