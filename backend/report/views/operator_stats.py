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
    - تبدیل‌ها (Listing های تبدیل شده به Property)
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        now = timezone.now()
        today_start = now.replace(
            hour=0,
            minute=0,
            second=0,
            microsecond=0,
        )

        # ==================================================
        # لیدها و تبدیل‌ها
        # ==================================================

        if user.is_owner:
            # همه لیدها
            my_leads = Listing.objects.count()

            # هر Property فقط یک بار شمرده شود
            my_conversions = (
                Listing.objects
                .filter(
                    review_status=Listing.ReviewStatus.PROMOTED,
                    property__isnull=False,
                )
                .values("property_id")
                .distinct()
                .count()
            )

        else:
            neighborhoods = user.service_neighborhoods.all()

            # Base filter: same as ListingSelector.for_user()
            base_filter = {
                "divar_neighborhood__in": neighborhoods,
            }
            if user.deal_type_scope:
                base_filter["category"] = user.deal_type_scope

            if neighborhoods.exists():

                # ------------------------------------------
                # لیدهای قابل دسترس Agent
                # ------------------------------------------

                my_leads = (
                    Listing.objects
                    .filter(**base_filter)
                    .distinct()
                    .count()
                )

                # ------------------------------------------
                # لیدهای تبدیل شده به Property
                # ------------------------------------------

                my_conversions = (
                    Listing.objects
                    .filter(
                        **base_filter,
                        review_status=Listing.ReviewStatus.PROMOTED,
                        property__isnull=False,
                    )
                    .values("property_id")
                    .distinct()
                    .count()
                )

            else:
                my_leads = 0
                my_conversions = 0

        # ==================================================
        # تماس‌های امروز
        # ==================================================

        my_calls_today = CallLog.objects.filter(
            agency=user.agency,
            handled_by=user,
            called_at__gte=today_start,
            is_deleted=False,
        ).count()

        # ==================================================
        # پیگیری‌های در انتظار
        # ==================================================

        my_pending_followups = Reminder.objects.filter(
            agency=user.agency,
            user=user,
            status=Reminder.Status.PENDING,
        ).count()

        # ==================================================
        # Response
        # ==================================================

        return Response(
            {
                "my_leads": my_leads,
                "my_calls_today": my_calls_today,
                "my_pending_followups": my_pending_followups,
                "my_conversions": my_conversions,
            }
        )