import  StatusBadge  from "@/shared/ui/badges/StatusBadge";
import { CALL_RESULT_CONFIG, CALL_TYPE_CONFIG } from "@/features/calls/config";
import { formatDate, formatDuration } from "@/utils/formatters";

/**
 * Call Log Table Columns
 * Backend: crm.CallLog
 */
export const CALL_TABLE_COLUMNS = [
  {
    key: "id",
    header: "شناسه",
    width: "w-14",
    cell: ({ id }) => <span className="text-xs text-muted-foreground font-mono">#{id}</span>,
  },
  {
    key: "customer",
    header: "مشتری",
    width: "w-40",
    searchable: true,
    searchFields: ["customer.full_name", "customer.phone"],
    cell: ({ customer }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{customer?.full_name || "—"}</span>
        <span className="text-xs text-muted-foreground font-mono ltr">{customer?.phone || "—"}</span>
      </div>
    ),
  },
  {
    key: "call_type",
    header: "نوع تماس",
    width: "w-24",
    filterKey: "call_type",
    cell: ({ call_type }) => {
      const cfg = CALL_TYPE_CONFIG[call_type];
      if (!cfg) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
          <cfg.icon className="w-3 h-3" />
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "result",
    header: "نتیجه",
    width: "w-28",
    filterKey: "result",
    cell: ({ result }) => <StatusBadge status={result} config={CALL_RESULT_CONFIG} />,
  },
  {
    key: "handled_by",
    header: "اپراتور",
    width: "w-32",
    cell: ({ handled_by }) => (
      <span className="text-sm">{handled_by?.full_name || "—"}</span>
    ),
  },
  {
    key: "related",
    header: "مرتبط با",
    width: "w-36",
    cell: ({ listing, property }) => {
      if (property) return <span className="text-xs font-mono text-primary">{property.property_code}</span>;
      if (listing) return <span className="text-xs text-muted-foreground truncate max-w-30">{listing.title}</span>;
      return <span className="text-muted-foreground text-xs">—</span>;
    },
  },
  {
    key: "called_at",
    header: "زمان تماس",
    width: "w-32",
    cell: ({ called_at }) => formatDate(called_at, "short"),
  },
  {
    key: "duration",
    header: "مدت",
    width: "w-20",
    cell: ({ call_duration }) => formatDuration(call_duration),
  },
  {
    key: "follow_up",
    header: "پیگیری",
    width: "w-28",
    cell: ({ next_follow_up_at, follow_up_done }) => {
      if (follow_up_done) return <span className="text-xs text-emerald-600">✓ انجام شد</span>;
      if (next_follow_up_at) return <span className="text-xs text-amber-600">{formatDate(next_follow_up_at, "short")}</span>;
      return <span className="text-muted-foreground text-xs">—</span>;
    },
  },
  {
    key: "actions",
    header: "",
    width: "w-20",
    actions: true,
  },
];