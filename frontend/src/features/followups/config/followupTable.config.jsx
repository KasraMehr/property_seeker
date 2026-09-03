import StatusBadge from "@/shared/ui/badges/StatusBadge";
import {
  FOLLOWUP_STATUS_CONFIG,
  FOLLOWUP_TYPE_CONFIG,
} from "@/features/followups/config";
import { buildStatusConfig } from "@/constants/status.utils";
import { formatDateTime } from "@/utils/formatters";
/**
 * Reminder (Follow-up) Table Columns
 * Backend: crm.Reminder
 */
export const FOLLOWUP_TABLE_COLUMNS = [
  // {
  //   key: "id",
  //   header: "شناسه",
  //   width: "w-14",
  //   cell: ({ id }) => (
  //     <span className="text-xs text-muted-foreground font-mono">#{id}</span>
  //   ),
  // },
  {
    key: "title",
    header: "عنوان وظیفه",
    width: "w-48",
    searchable: true,
    cell: ({ title, description, due_at, status }) => {
      const isToday = status === "pending" && due_at && new Date(due_at).toDateString() === new Date().toDateString();
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            {isToday && (
              <span className="shrink-0 w-2 h-2 rounded-full bg-amber-500" title="موعد امروز" />
            )}
            <span className="font-medium text-sm truncate max-w-45" title={title}>
              {title}
            </span>
          </div>
          {description && (
            <span className="text-xs text-muted-foreground truncate max-w-45">
              {description}
            </span>
          )}
        </div>
      );
    },
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
      <StatusBadge config={buildStatusConfig(FOLLOWUP_STATUS_CONFIG, status)} />
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
      const dueDate = new Date(due_at);
      const now = new Date();
      const isOverdue = status === "pending" && dueDate < now && dueDate.toDateString() !== now.toDateString();
      const isToday = status === "pending" && dueDate.toDateString() === now.toDateString();
      return (
        <span
          className={`text-sm ${
            isOverdue
              ? "text-danger font-semibold"
              : isToday
                ? "text-amber-600 font-semibold"
                : ""
          }`}
        >
          {formatDateTime(due_at)}
          {isOverdue && (
            <span className="text-xs text-danger mr-1">(گذشته)</span>
          )}
          {isToday && (
            <span className="text-xs text-amber-600 mr-1">(امروز)</span>
          )}
        </span>
      );
    },
  },
  // {
  //   key: "actions",
  //   header: "",
  //   width: "w-20",
  //   actions: true,
  // },
];
