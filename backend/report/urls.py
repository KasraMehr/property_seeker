from django.urls import path

from report.views.dashboard import DashboardView
from report.views.monthly_report import *
from report.views.report_as_date import *
from report.views.operator_stats import OperatorStatsView

urlpatterns = [
    path("dashboard/", DashboardView.as_view()),
    path("statistics/", StatisticsReportView.as_view()),
    path("operator/statistics/", OperatorStatsView.as_view()),
    # path(
    #   "employees/",
    #  EmployeeReportView.as_view()
    # ),
    path("report/properties/", PropertyReportView.as_view()),
    path("charts/monthly-deals/", MonthlyDealsChartView.as_view()),
    path("charts/revenue/", MonthlyRevenueView.as_view()),
    path("employees/top/", TopEmployeeView.as_view()),
    path("customers/monthly/", MonthlyCustomersView.as_view()),
    path("properties/monthly/", MonthlyPropertiesView.as_view()),
    path("financial/", FinancialReportView.as_view()),
]
