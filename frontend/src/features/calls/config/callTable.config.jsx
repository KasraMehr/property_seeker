import { formatDateTime } from "@/utils/formatters";
import { CALL_RESULT_CONFIG, CALL_TYPE_CONFIG } from "./callStatus.config";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { PhoneIncoming, PhoneOutgoing, User, Home, FileText } from "lucide-react";

/* ─── Helper: format seconds → mm:ss ─── */
function fmtDuration(sec) {
  if (!sec && sec !== 0) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/* ─── Helper: CallTypeBadge ─── */
function CallTypeBadge({ type }) {
  const cfg = CALL_TYPE_CONFIG[type];
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
export const CALL_TABLE_COLUMNS = [
  {
    key: "id",
    title: "شناسه",
    width: "70px",
    align: "center",
    sortable: true,
    render: (row) => (
      <span className="text-xs font-mono text-muted dir-ltr">#{row.id}</span>
    ),
  },
  {
    key: "call_type",
    title: "نوع",
    width: "80px",
    align: "center",
    sortable: true,
    render: (row) => <CallTypeBadge type={row.call_type} />,
  },
  {
    key: "customer",
    title: "مشتری",
    width: "140px",
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
    width: "180px",
    sortable: false,
    render: (row) => (
      <div className="flex items-center gap-1.5 text-sm text-foreground">
        <Home size={13} className="text-muted" />
        <span className="truncate">{row.property?.title || "—"}</span>
      </div>
    ),
  },
  {
    key: "listing",
    title: "آگهی",
    width: "100px",
    align: "center",
    sortable: false,
    render: (row) =>
      row.listing ? (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary">
          <FileText size={10} />
          آگهی
        </span>
      ) : (
        <span className="text-xs text-muted">—</span>
      ),
  },
  {
    key: "handled_by",
    title: "اپراتور",
    width: "130px",
    sortable: false,
    render: (row) => (
      <span className="text-xs text-muted">{row.handled_by?.full_name || "—"}</span>
    ),
  },
  {
    key: "result",
    title: "نتیجه",
    width: "110px",
    align: "center",
    sortable: true,
    render: (row) => {
      const cfg = CALL_RESULT_CONFIG[row.result];
      return cfg ? (
        <StatusBadge config={cfg} variant="soft" size="sm" />
      ) : (
        <span className="text-xs text-muted">—</span>
      );
    },
  },
  {
    key: "call_duration",
    title: "مدت",
    width: "70px",
    align: "center",
    sortable: true,
    render: (row) => (
      <span className="text-xs font-mono text-muted dir-ltr">{fmtDuration(row.call_duration)}</span>
    ),
  },
  {
    key: "called_at",
    title: "تاریخ تماس",
    width: "130px",
    align: "center",
    sortable: true,
    render: (row) => (
      <span className="text-xs text-muted">{formatDateTime(row.called_at)}</span>
    ),
  },
  {
    key: "note",
    title: "یادداشت",
    width: "200px",
    sortable: false,
    render: (row) => (
      <p className="text-xs text-muted truncate" title={row.note}>
        {row.note || "—"}
      </p>
    ),
  },
];