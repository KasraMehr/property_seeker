from django.shortcuts import render

# Create your views here.
from django.db.models.functions import ExtractMonth
from rest_framework.views import APIView
from rest_framework.response import Response
from crm.models import *
from properties.models import *
from deals.models import *
from accounts.permissions import *
from accounts.models import *
from django.db.models import Sum, Avg

class MonthlyDealsChartView(APIView):
    permission_classes = (
        IsAgencyOwner,
    )
    def get(self, request):

        agency = request.user.agency
        year = request.GET.get("year")

        data = (
            Deal.objects
            .filter(
                agency=agency,
                deal_date__year=year
            )
            .annotate(
                month=ExtractMonth("deal_date")
            )
            .values("month")
            .annotate(
                total=Count("id")
            )
            .order_by("month")
        )

        return Response(data)


from django.db.models import Sum
from django.db.models.functions import ExtractMonth


class MonthlyRevenueView(APIView):

    permission_classes = (
        IsAgencyOwner,
    )

    def get(self, request):

        year = request.GET.get("year")

        data = (
            Deal.objects
            .filter(
                agency=request.user.agency,
                deal_date__year=year,
                status=Deal.Status.CONTRACTED
            )
            .annotate(
                month=ExtractMonth("deal_date")
            )
            .values("month")
            .annotate(
                revenue=Sum(
                    "commission_amount"
                )
            )
            .order_by("month")
        )

        return Response(data)


from django.db.models import Count

from django.db.models import Count, Sum, Q
from django.utils import timezone
from accounts.models import User
from deals.models import Deal


class TopEmployeeView(APIView):

    permission_classes = (
        IsAgencyOwner,
    )

    def get(self, request):

        year = request.GET.get(
            "year",
            timezone.now().year
        )

        month = request.GET.get(
            "month"
        )


        filters = {
            "agency": request.user.agency,
            "deals__is_deleted": False,
            "deals__status__in": [
                Deal.Status.CONTRACTED,
                Deal.Status.PAID,
            ],
            "deals__deal_date__year": year,
        }


        if month:
            filters[
                "deals__deal_date__month"
            ] = month


        employees = (
            User.objects
            .filter(
                agency=request.user.agency,
                is_owner=False,
            )
            .annotate(

                deals_count=Count(
                    "deals",
                    filter=Q(**filters)
                ),


                total_sales=Sum(
                    "deals__price",
                    filter=Q(**filters)
                ),


                total_commission=Sum(
                    "deals__commission_amount",
                    filter=Q(**filters)
                )

            )
            .order_by(
                "-deals_count"
            )[:10]
        )


        return Response(
            employees.values(
                "id",
                "full_name",
                "deals_count",
                "total_sales",
                "total_commission",
            )
        )


from django.db.models.functions import ExtractMonth
from django.db.models import Count


class MonthlyCustomersView(APIView):

    permission_classes = (
        IsAgencyOwner,
    )

    def get(self, request):

        year = request.GET.get("year")

        data = (

            Customer.objects

            .filter(
                agency=request.user.agency,
                created_at__year=year
            )

            .annotate(
                month=ExtractMonth(
                    "created_at"
                )
            )

            .values(
                "month"
            )

            .annotate(
                total=Count("id")
            )

            .order_by(
                "month"
            )
        )

        return Response(data)


class MonthlyPropertiesView(APIView):
    permission_classes = (
        IsAgencyOwner,
    )
    def get(self, request):

        year = request.GET.get("year")

        data = (

            Property.objects

            .filter(
                agency=request.user.agency,
                created_at__year=year
            )

            .annotate(
                month=ExtractMonth(
                    "created_at"
                )
            )

            .values(
                "month"
            )

            .annotate(
                total=Count("id")
            )
        )

        return Response(data)


class FinancialReportView(APIView):

    def get(self, request):

        deals = Deal.objects.filter(
            agency=request.user.agency,
            status=Deal.Status.CONTRACTED
        )

        return Response({

            "total_income":

                deals.aggregate(
                    total=Sum(
                        "commission_amount"
                    )
                )["total"] or 0,

            "average_income":

                deals.aggregate(
                    avg=Avg(
                        "commission_amount"
                    )
                )["avg"] or 0,

            "deals_count":
                deals.count()
        })