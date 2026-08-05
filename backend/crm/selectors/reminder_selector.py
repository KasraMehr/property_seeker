from django.shortcuts import get_object_or_404

from ..models import Reminder



class ReminderSelector:



    @staticmethod
    def all(user):

        return (
            Reminder.objects
            .select_related(
                "user",
                "customer",
                "property"
            )
            .filter(
                agency=user.agency,

            )
            .order_by(
                "due_at"
            )
        )



    @staticmethod
    def by_id(pk,user):

        return get_object_or_404(

            Reminder.objects
            .select_related(
                "user",
                "customer",
                "property"
            ),

            id=pk,
            agency=user.agency,

        )



    @staticmethod
    def by_user(user):

        return Reminder.objects.filter(
            user=user,

        ).order_by(
            "due_at"
        )



    @staticmethod
    def by_status(status,user):

        return Reminder.objects.filter(
            agency=user.agency,
            status=status,
            
        )