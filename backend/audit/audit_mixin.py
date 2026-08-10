"""from rest_framework import viewsets

from audit.services.activity_services import *

from audit.models import ActivityLog

class AuditModelViewSet(viewsets.ModelViewSet):

    detail_serializer_class = None

    def perform_create(self, serializer):

        instance = serializer.save()

        if self.detail_serializer_class:

            ActivityLogService.log(
                request=self.request,
                user=self.request.user,
                action=ActivityLog.Action.CREATE,
                entity_type=instance.__class__.__name__,
                entity_id=instance.pk,
                new_data=self.detail_serializer_class(instance).data,
            )

    def perform_update(self, serializer):

        instance = serializer.instance

        old_data = {}

        if self.detail_serializer_class:
            old_data = self.detail_serializer_class(instance).data

        instance = serializer.save()

        ActivityLogService.log(
            request=self.request,
            user=self.request.user,
            action=ActivityLog.Action.UPDATE,
            entity_type=instance.__class__.__name__,
            entity_id=instance.pk,
            old_data=old_data,
            new_data=self.detail_serializer_class(instance).data
            if self.detail_serializer_class else {},
        )

    def perform_destroy(self, instance):

        old_data = {}

        if self.detail_serializer_class:
            old_data = self.detail_serializer_class(instance).data

        ActivityLogService.log(
            request=self.request,
            user=self.request.user,
            action=ActivityLog.Action.DELETE,
            entity_type=instance.__class__.__name__,
            entity_id=instance.pk,
            old_data=old_data,
        )

        instance.delete()"""
