import { buildStatusConfig } from "@/constants/status.utils";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { CALL_RESULT_CONFIG, CALL_TYPE_CONFIG } from "@/features/calls/config";
import { formatDate } from "@/utils/formatters";

export const CALL_TABLE_COLUMNS = [
  // {
  //   key: "id",
  //   header: "شناسه",
  //   width: "w-14",
  //   cell: ({ id }) => <span className="text-xs text-muted-foreground font-mono">#{id}</span>,
  // },
  {
    key: "customer_name",
    header: "مشتری",
    width: "w-44",
    searchable: true,
    cell: ({ customer_name }) => (
      <span className="font-medium text-sm">{customer_name || "—"}</span>
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
    cell: ({ result }) => <StatusBadge config={buildStatusConfig(CALL_RESULT_CONFIG, result)} />,
  },
  {
    key: "agent_name",
    header: "اپراتور",
    width: "w-32",
    cell: ({ agent_name }) => (
      <span className="text-sm">{agent_name || "—"}</span>
    ),
  },
  {
    key: "called_at",
    header: "زمان تماس",
    width: "w-32",
    cell: ({ called_at }) => formatDate(called_at, "short"),
  },
  // {
  //   key: "actions",
  //   header: "",
  //   width: "w-20",
  //   actions: true,
  // },
];