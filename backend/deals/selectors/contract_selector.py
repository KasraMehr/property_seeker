from django.shortcuts import get_object_or_404

from ..models import Contract


def get_contracts():
    return (
        Contract.objects
        .select_related("deal")
        .order_by("-created_at")
    )


def get_contract(pk):
    return get_object_or_404(
        Contract.objects.select_related("deal"),
        pk=pk
    )