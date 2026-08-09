from crm.models import Reminder


class ReminderSelector:

    @staticmethod
    def all(user):

        return (
            Reminder.objects.select_related(
                "agency",
                "user",
                "customer",
                "property",
            )
            .filter(agency=user.agency)
            .order_by("due_at")
        )

    @staticmethod
    def by_id(pk, user):

        return Reminder.objects.select_related(
            "agency",
            "user",
            "customer",
            "property",
        ).get(pk=pk, agency=user.agency)
