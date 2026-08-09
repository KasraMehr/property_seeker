import StatusBadge from "@/shared/ui/badges/StatusBadge";
import {
  ACTIVITY_LOG_STATUS,
} from "@/features/activity-log/config";
import { formatDate } from "@/utils/formatters";

/**
 * ActivityLog Table Columns
 * Backend: audit.ActivityLog
 */
export const ACTIVITY_LOG_TABLE_COLUMNS = [
  {
    key: "id",
    header: "شناسه",
    width: "w-14",
    cell: ({ id }) => (
      <span className="text-xs text-muted-foreground font-mono">#{id}</span>
    ),
  },
  {
    key: "action",
    header: "عملیات",
    width: "w-28",
    filterKey: "action",
    cell: ({ action }) => {
      const cfg = ACTIVITY_LOG_ACTION_CONFIG[action];
      if (!cfg) return <span className="text-muted-foreground text-xs">—</span>;
      const Icon = cfg.icon;
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
          <Icon className={`w-3.5 h-3.5 text-${cfg.color}-500`} />
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "level",
    header: "سطح",
    width: "w-24",
    filterKey: "level",
    cell: ({ level }) => (
      <StatusBadge status={level} config={ACTIVITY_LOG_LEVEL_CONFIG} />
    ),
  },
  {
    key: "entity",
    header: "موجودیت",
    width: "w-36",
    cell: ({ entity_type, entity_id }) => (
      <div className="flex flex-col">
        <span className="text-xs font-medium">{entity_type || "—"}</span>
        <span className="text-xs text-muted-foreground font-mono">
          ID: {entity_id || "—"}
        </span>
      </div>
    ),
  },
  {
    key: "user",
    header: "کاربر",
    width: "w-32",
    cell: ({ user }) => <span className="text-sm">{user || "سیستم"}</span>,
  },
  {
    key: "created_at",
    header: "زمان",
    width: "w-32",
    cell: ({ created_at }) => formatDate(created_at, "short"),
  },
];
