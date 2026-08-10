import StatusBadge from "@/shared/ui/badges/StatusBadge";
import {
  FOLLOWUP_STATUS_CONFIG,
  FOLLOWUP_TYPE_CONFIG,
} from "@/features/followups/config";
import { formatDate } from "@/utils/formatters";
/**
 * Reminder (Follow-up) Table Columns
 * Backend: crm.Reminder
 */
export const FOLLOWUP_TABLE_COLUMNS = [
  {
    key: "id",
    header: "شناسه",
    width: "w-14",
    cell: ({ id }) => (
      <span className="text-xs text-muted-foreground font-mono">#{id}</span>
    ),
  },
  {
    key: "title",
    header: "عنوان وظیفه",
    width: "w-48",
    searchable: true,
    cell: ({ title, description }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm truncate max-w-45" title={title}>
          {title}
        </span>
        {description && (
          <span className="text-xs text-muted-foreground truncate max-w-45">
            {description}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "type",
    header: "نوع",
    width: "w-24",
    filterKey: "type",
    cell: ({ type }) => {
      const cfg = FOLLOWUP_TYPE_CONFIG[type];
      if (!cfg) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}
        >
          <cfg.icon className="w-3 h-3" />
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "وضعیت",
    width: "w-24",
    filterKey: "status",
    cell: ({ status }) => (
      <StatusBadge status={status} config={FOLLOWUP_STATUS_CONFIG} />
    ),
  },
  {
    key: "user_name",
    header: "مسئول",
    width: "w-32",
    cell: ({ user_name }) => (
      <span className="text-sm">{user_name || "—"}</span>
    ),
  },
  {
    key: "customer_property",
    header: "مشتری / ملک",
    width: "w-40",
    cell: ({ customer_name, property_code }) => {
      if (customer_name)
        return <span className="text-sm">{customer_name}</span>;
      if (property_code)
        return (
          <span className="text-xs font-mono text-primary">
            {property_code}
          </span>
        );
      return <span className="text-muted-foreground text-xs">—</span>;
    },
  },
  {
    key: "due_at",
    header: "موعد انجام",
    width: "w-32",
    cell: ({ due_at, status }) => {
      const isOverdue = status === "pending" && new Date(due_at) < new Date();
      return (
        <span
          className={`text-sm ${isOverdue ? "text-danger font-semibold" : ""}`}
        >
          {formatDate(due_at, "short")}
          {isOverdue && (
            <span className="text-xs text-danger mr-1">(گذشته)</span>
          )}
        </span>
      );
    },
  },
  {
    key: "actions",
    header: "",
    width: "w-20",
    actions: true,
  },
];
