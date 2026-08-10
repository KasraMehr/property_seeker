from django.db.models import Count
from django.shortcuts import get_object_or_404

from ..models import Owner


class OwnerSelector:

    @staticmethod
    def all(agency):
        return (
            Owner.objects.filter(agency=agency)
            .annotate(properties_count=Count("properties"))
            .order_by("-created_at")
        )

    @staticmethod
    def by_id(owner_id, agency):

        return get_object_or_404(
            Owner.objects.filter(agency=agency).prefetch_related("properties"),
            pk=owner_id,
        )

    @staticmethod
    def by_phone(phone, agency):

        return Owner.objects.filter(
            agency=agency,
            phone=phone,
        ).first()

    @staticmethod
    def search(query, agency):

        return (
            Owner.objects.filter(agency=agency).filter(full_name__icontains=query)
            | Owner.objects.filter(agency=agency).filter(phone__icontains=query)
        ).distinct()

    @staticmethod
    def detail(owner_id, agency):

        return get_object_or_404(
            Owner.objects.filter(agency=agency).annotate(
                properties_count=Count("properties")
            ),
            pk=owner_id,
        )
