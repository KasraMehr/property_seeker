from django.db.models import Count
from django.shortcuts import get_object_or_404

from ..models import Owner


class OwnerSelector:

    @staticmethod
    def all(agency, created_by):
        return (
            Owner.objects.filter(
                agency=agency,
                created_by=created_by,
            )
            .annotate(properties_count=Count("properties"))
            .order_by("-created_at")
        )

    @staticmethod
    def by_id(owner_id, agency, created_by):
        return get_object_or_404(
            Owner.objects.filter(
                agency=agency,
                created_by=created_by,
            ).prefetch_related("properties"),
            pk=owner_id,
        )

    @staticmethod
    def by_phone(phone, agency, created_by):
        return Owner.objects.filter(
            agency=agency,
            created_by=created_by,
            phone=phone,
        ).first()

    @staticmethod
    def search(query, agency, created_by):
        return (
            Owner.objects.filter(
                agency=agency,
                created_by=created_by,
                full_name__icontains=query,
            )
            | Owner.objects.filter(
                agency=agency,
                created_by=created_by,
                phone__icontains=query,
            )
        ).distinct()

    @staticmethod
    def detail(owner_id, agency, created_by):
        return get_object_or_404(
            Owner.objects.filter(
                agency=agency,
                created_by=created_by,
            ).annotate(
                properties_count=Count("properties")
            ),
            pk=owner_id,
        )

