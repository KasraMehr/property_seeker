from django.shortcuts import get_object_or_404

from ..models import Contract



class ContractSelector:


    @staticmethod
    def all(user):

        return (
            Contract.objects
            .filter(
                agency=user.agency
            )
            .select_related(
                "deal",
                "created_by",
            )
        )


    @staticmethod
    def by_id(user,pk):

        return get_object_or_404(

            Contract.objects.select_related(
                "deal",
                "created_by",
            ),

            id=pk,
            agency=user.agency
        )