from django.shortcuts import get_object_or_404

from audit.models import ActivityLog


class ActivitySelector:

    @staticmethod
    def all():

        return ActivityLog.objects.select_related("user").order_by("-created_at")

    @staticmethod
    def by_id(pk):

        return get_object_or_404(
            ActivityLog.objects.select_related("user"),
            pk=pk,
        )

    @staticmethod
    def by_action(action):

        return ActivityLog.objects.select_related("user").filter(action=action)

    @staticmethod
    def by_entity(entity_type, entity_id):

        return ActivityLog.objects.select_related("user").filter(
            entity_type=entity_type,
            entity_id=entity_id,
        )

    @staticmethod
    def by_request_id(request_id):

        return ActivityLog.objects.select_related("user").filter(request_id=request_id)
