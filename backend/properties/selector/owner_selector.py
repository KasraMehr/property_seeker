from django.db.models import Count
from django.shortcuts import get_object_or_404

from ..models import Owner


class OwnerSelector:

    @staticmethod
    def all(agency, created_by=None):
        qs = Owner.objects.filter(agency=agency)
        if created_by is not None:
            qs = qs.filter(created_by=created_by)
        return (
            qs
            .annotate(properties_count=Count("properties"))
            .order_by("-created_at")
        )

    @staticmethod
    def by_id(owner_id, agency, created_by=None):
        qs = Owner.objects.filter(agency=agency)
        if created_by is not None:
            qs = qs.filter(created_by=created_by)
        return get_object_or_404(
            qs.prefetch_related("properties"),
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
    def search(query, agency, created_by=None):
        name_qs = Owner.objects.filter(
            agency=agency,
            full_name__icontains=query,
        )
        phone_qs = Owner.objects.filter(
            agency=agency,
            phone__icontains=query,
        )
        if created_by is not None:
            name_qs = name_qs.filter(created_by=created_by)
            phone_qs = phone_qs.filter(created_by=created_by)
        return (name_qs | phone_qs).distinct()

    @staticmethod
    def detail(owner_id, agency, created_by=None):
        qs = Owner.objects.filter(agency=agency)
        if created_by is not None:
            qs = qs.filter(created_by=created_by)
        return get_object_or_404(
            qs.annotate(
                properties_count=Count("properties")
            ),
            pk=owner_id,
        )

