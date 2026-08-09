import  StatusBadge  from "@/shared/ui/badges/StatusBadge";
import {
  ACTIVITY_LOG_ALL_ACTIONS,
  ACTIVITY_LOG_OUTCOME_CONFIG,
  ACTIVITY_LOG_LEVEL_CONFIG,
  ACTIVITY_LOG_SOURCE_CONFIG,
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
      const cfg = ACTIVITY_LOG_ALL_ACTIONS[action];
      if (!cfg) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
          <cfg.icon className={`w-3.5 h-3.5 text-${cfg.color}-500`} />
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "source",
    header: "منبع",
    width: "w-24",
    filterKey: "source",
    cell: ({ source }) => {
      const cfg = ACTIVITY_LOG_SOURCE_CONFIG[source];
      if (!cfg) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
          <cfg.icon className={`w-3.5 h-3.5 text-${cfg.color}-500`} />
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
    key: "outcome",
    header: "نتیجه",
    width: "w-24",
    filterKey: "outcome",
    cell: ({ outcome }) => {
      const cfg = ACTIVITY_LOG_OUTCOME_CONFIG[outcome];
      if (!cfg) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium ${outcome === "success" ? "text-emerald-600" : "text-danger"}`}
        >
          <cfg.icon className="w-3.5 h-3.5" />
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "entity",
    header: "موجودیت",
    width: "w-32",
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
    cell: ({ user }) => (
      <span className="text-sm">{user?.full_name || "سیستم"}</span>
    ),
  },
  {
    key: "message",
    header: "پیام",
    width: "w-48",
    cell: ({ message }) => (
      <span
        className="text-xs text-muted-foreground truncate max-w-45"
        title={message}
      >
        {message || "—"}
      </span>
    ),
  },
  {
    key: "created_at",
    header: "زمان",
    width: "w-32",
    cell: ({ created_at }) => formatDate(created_at, "short"),
  },
  {
    key: "actions",
    header: "",
    width: "w-20",
    actions: true,
  },
];
