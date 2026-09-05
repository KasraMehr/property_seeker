from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from crm.models import CallLog, Reminder
from listing.models import Listing


class OperatorStatsView(APIView):
    """
    آمار شخصی اپراتور:
    - تعداد لیدهای قابل دسترس
    - تماس‌های امروز
    - پیگیری‌های در انتظار
    - تبدیل‌ها (لیستینگ‌های تبدیل شده به ملک)
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

        # ─── لیدهای قابل دسترس ───
        if user.is_owner:
            my_leads = Listing.objects.count()
            my_conversions = Listing.objects.filter(
                review_status=Listing.ReviewStatus.PROMOTED
            ).count()
        else:
            neighborhoods = user.service_neighborhoods.all()
            if neighborhoods.exists():
                my_leads = Listing.objects.filter(
                    property__divar_neighborhood__in=neighborhoods
                ).distinct().count()
                my_conversions = Listing.objects.filter(
                    property__divar_neighborhood__in=neighborhoods,
                    review_status=Listing.ReviewStatus.PROMOTED,
                ).distinct().count()
            else:
                my_leads = 0
                my_conversions = 0

        # ─── تماس‌های امروز ───
        my_calls_today = CallLog.objects.filter(
            agency=user.agency,
            handled_by=user,
            called_at__gte=today_start,
            is_deleted=False,
        ).count()

        # ─── پیگیری‌های در انتظار ───
        my_pending_followups = Reminder.objects.filter(
            agency=user.agency,
            user=user,
            status=Reminder.Status.PENDING,
        ).count()

        return Response({
            "my_leads": my_leads,
            "my_calls_today": my_calls_today,
            "my_pending_followups": my_pending_followups,
            "my_conversions": my_conversions,
        })
