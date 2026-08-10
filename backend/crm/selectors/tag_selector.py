from crm.models import Tag


class TagSelector:

    @staticmethod
    def all(user):

        return Tag.objects.filter(agency=user.agency).order_by("-id")

    @staticmethod
    def by_id(pk, user):

        return Tag.objects.get(id=pk, agency=user.agency)
