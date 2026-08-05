from crm.models import CallLog


class CallLogSelector:

    @staticmethod
    def all(user):

        return CallLog.objects.filter(
            agency=user.agency,
            is_deleted=False
        )

    @staticmethod
    def by_id(pk, user):

        return CallLog.objects.get(
            id=pk,
            agency=user.agency,
            is_deleted=False
        )