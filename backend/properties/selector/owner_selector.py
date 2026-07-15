from django.shortcuts import get_object_or_404


from django.db.models import Count

from ..models import Owner

class OwnerSelector:

    @staticmethod
    def all():
        return (
            Owner.objects
            .annotate(properties_count=Count("properties"))
            .order_by("-created_at")
        )

    @staticmethod
    def by_id(owner_id):

        return get_object_or_404(
            Owner.objects.prefetch_related("properties"),
            pk=owner_id,
        )

    @staticmethod
    def by_phone(phone):

        return (
            Owner.objects
            .filter(phone=phone)
            .first()
        )

    @staticmethod
    def search(query):

        return (
            Owner.objects.filter(
                full_name__icontains=query
            ) |
            Owner.objects.filter(
                phone__icontains=query
            )
        ).distinct()

    @staticmethod
    def detail(pk):
        return get_object_or_404(
            Owner.objects.annotate(
                properties_count=Count("properties")
            ),
            pk=pk,
        )
