import { formatDate, formatDateTime } from "@/utils/formatters";
import { FOLLOWUP_STATUS_CONFIG, FOLLOWUP_TYPE_CONFIG } from "./followupStatus.config";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { Clock, MapPin, Users, FileText, Phone, User, Home, Calendar, CheckCircle2 } from "lucide-react";

/* ─── Helper: TypeTag ─── */
function TypeTag({ type }) {
  const cfg = FOLLOWUP_TYPE_CONFIG[type];
  if (!cfg) return <span className="text-xs text-muted">—</span>;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${cfg.bg} ${cfg.text}`}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

/* ─── Columns ─── */
export const FOLLOWUP_TABLE_COLUMNS = [
  {
    key: "id",
    title: "شناسه",
    width: "60px",
    align: "center",
    sortable: true,
    render: (row) => (
      <span className="text-xs font-mono text-muted dir-ltr">#{row.id}</span>
    ),
  },
  {
    key: "title",
    title: "عنوان",
    width: "220px",
    sortable: true,
    render: (row) => (
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-foreground truncate">
          {row.title}
        </span>
        {row.description && (
          <p className="text-[11px] text-muted truncate" title={row.description}>
            {row.description}
          </p>
        )}
      </div>
    ),
  },
  {
    key: "type",
    title: "نوع",
    width: "80px",
    align: "center",
    sortable: true,
    render: (row) => <TypeTag type={row.type} />,
  },
  {
    key: "customer",
    title: "مشتری",
    width: "130px",
    sortable: false,
    render: (row) => (
      <div className="flex items-center gap-1.5 text-sm text-foreground">
        <User size={13} className="text-muted" />
        <span className="truncate">{row.customer?.full_name || "—"}</span>
      </div>
    ),
  },
  {
    key: "property",
    title: "ملک",
    width: "160px",
    sortable: false,
    render: (row) =>
      row.property ? (
        <div className="flex items-center gap-1.5 text-sm text-foreground">
          <Home size={13} className="text-(--role-primary)" />
          <span className="truncate">{row.property.title}</span>
        </div>
      ) : (
        <span className="text-xs text-muted">—</span>
      ),
  },
  {
    key: "user",
    title: "مسئول",
    width: "130px",
    sortable: false,
    render: (row) => (
      <span className="text-xs text-muted">{row.user?.full_name || "—"}</span>
    ),
  },
  {
    key: "status",
    title: "وضعیت",
    width: "100px",
    align: "center",
    sortable: true,
    render: (row) => {
      const cfg = FOLLOWUP_STATUS_CONFIG[row.status];
      return cfg ? (
        <StatusBadge config={cfg} variant="soft" size="sm" />
      ) : (
        <span className="text-xs text-muted">—</span>
      );
    },
  },
  {
    key: "due_at",
    title: "سررسید",
    width: "110px",
    align: "center",
    sortable: true,
    render: (row) => (
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs text-foreground">{formatDate(row.due_at)}</span>
        {row.status === "completed" && row.completed_at && (
          <span className="text-[10px] text-emerald-500">
            <CheckCircle2 size={10} className="inline ml-0.5" />
            {formatDate(row.completed_at)}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "created_at",
    title: "تاریخ ثبت",
    width: "100px",
    align: "center",
    sortable: true,
    render: (row) => (
      <span className="text-xs text-muted">{formatDate(row.created_at)}</span>
    ),
  },
];