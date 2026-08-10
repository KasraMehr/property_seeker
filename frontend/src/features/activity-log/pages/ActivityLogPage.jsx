
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useActivityLog from "../hooks/useActivityLog";
import { ACTIVITY_LOG_TABLE_COLUMNS } from "../config";
import activityLogService from "../services/activityLogService";

export default function ActivityLogPage() {
  const resource = useActivityLog();

  return (
    <ResourceTemplate
      title="تاریخچه فعالیت‌ها"
      subtitle="مشاهده و بررسی فعالیت‌های کاربران و تغییرات سیستم"
      resource={resource}
      service={activityLogService}
      columns={ACTIVITY_LOG_TABLE_COLUMNS}
      filterSchema={[]}
      entityName="لاگ"
      permissionPrefix="audit"
      readOnly={true} // ActivityLog is read-only (no create/update/delete actions)
    />
  );
}