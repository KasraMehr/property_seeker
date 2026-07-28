import traceback

from ..models import ActivityLog


class ActivityLogService:

    @staticmethod
    def _create(
        *,
        request,
        action,
        entity_type,
        entity_id,
        old_data=None,
        new_data=None,
        message="",
        outcome=ActivityLog.Outcome.SUCCESS,
        level=ActivityLog.Level.INFO,
        status_code=None,
        error_trace="",
    ):

        ActivityLog.objects.create(
            user=request.user if request.user.is_authenticated else None,

            action=action,

            source=ActivityLog.Source.API,

            level=level,

            outcome=outcome,

            entity_type=entity_type,

            entity_id=str(entity_id),

            old_data=old_data or {},

            new_data=new_data or {},

            request_method=request.method,

            request_path=request.path,

            query_params=request.query_params.dict(),

            status_code=status_code,

            ip_address=request.META.get("REMOTE_ADDR"),

            user_agent=request.META.get(
                "HTTP_USER_AGENT",
                "",
            ),

            message=message,

            error_trace=error_trace,
        )

    # -------------------------
    # CRUD
    # -------------------------

    @classmethod
    def create(
        cls,
        request,
        entity_type,
        entity_id,
        new_data=None,
        message="",
        status_code=201,
    ):
        cls._create(
            request=request,
            action=ActivityLog.Action.CREATE,
            entity_type=entity_type,
            entity_id=entity_id,
            new_data=new_data,
            message=message,
            status_code=status_code,
        )

    @classmethod
    def update(
        cls,
        request,
        entity_type,
        entity_id,
        old_data=None,
        new_data=None,
        message="",
        status_code=200,
    ):
        cls._create(
            request=request,
            action=ActivityLog.Action.UPDATE,
            entity_type=entity_type,
            entity_id=entity_id,
            old_data=old_data,
            new_data=new_data,
            message=message,
            status_code=status_code,
        )

    @classmethod
    def delete(
        cls,
        request,
        entity_type,
        entity_id,
        old_data=None,
        message="",
        status_code=204,
    ):
        cls._create(
            request=request,
            action=ActivityLog.Action.DELETE,
            entity_type=entity_type,
            entity_id=entity_id,
            old_data=old_data,
            message=message,
            status_code=status_code,
        )

    @classmethod
    def view(
        cls,
        request,
        entity_type,
        entity_id,
        message="",
        status_code=200,
    ):
        cls._create(
            request=request,
            action=ActivityLog.Action.VIEW,
            entity_type=entity_type,
            entity_id=entity_id,
            message=message,
            status_code=status_code,
        )

    # -------------------------
    # Auth
    # -------------------------

    @classmethod
    def login(
        cls,
        request,
        user,
    ):
        cls._create(
            request=request,
            action=ActivityLog.Action.LOGIN,
            entity_type="User",
            entity_id=user.id,
            message="ورود موفق",
            status_code=200,
        )

    @classmethod
    def logout(
        cls,
        request,
    ):
        cls._create(
            request=request,
            action=ActivityLog.Action.LOGOUT,
            entity_type="User",
            entity_id=request.user.id,
            message="خروج از سیستم",
            status_code=200,
        )

    # -------------------------
    # Status Change
    # -------------------------

    @classmethod
    def status_change(
        cls,
        request,
        entity_type,
        entity_id,
        old_status,
        new_status,
        message="",
    ):
        cls._create(
            request=request,
            action=ActivityLog.Action.STATUS_CHANGE,
            entity_type=entity_type,
            entity_id=entity_id,
            old_data={"status": old_status},
            new_data={"status": new_status},
            message=message,
            status_code=200,
        )

    # -------------------------
    # Error
    # -------------------------

    @classmethod
    def error(
        cls,
        request,
        action,
        entity_type,
        entity_id,
        exception,
        status_code=500,
    ):
        cls._create(
            request=request,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            outcome=ActivityLog.Outcome.FAILED,
            level=ActivityLog.Level.ERROR,
            status_code=status_code,
            message=str(exception),
            error_trace=traceback.format_exc(),
        )

    @classmethod
    def login_failed(
            cls,
            request,
            phone,
            message="ورود ناموفق",
    ):
        cls._create(
            request=request,
            action=ActivityLog.Action.LOGIN,
            entity_type="User",
            entity_id=phone,
            outcome=ActivityLog.Outcome.FAILED,
            level=ActivityLog.Level.WARNING,
            status_code=401,
            message=message,
        )

    @classmethod
    def logout_failed(
            cls,
            request,
            message="خروج ناموفق",
    ):
        cls._create(
            request=request,
            action=ActivityLog.Action.LOGOUT,
            entity_type="User",
            entity_id=request.user.id if request.user.is_authenticated else "UNKNOWN",
            outcome=ActivityLog.Outcome.FAILED,
            level=ActivityLog.Level.WARNING,
            status_code=400,
            message=message,
        )