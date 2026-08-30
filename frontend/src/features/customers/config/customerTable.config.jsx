import CustomerTypeBadge from "../components/CustomerTypeBadge";
import SourceBadge from "@/shared/ui/badges/SourceBadge";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { formatDate } from "@/utils/formatters";
import { buildStatusConfig } from "@/constants/status.utils";
import { CUSTOMER_STATUS_CONFIG } from "./customerStatus.config";

export const CUSTOMER_TABLE_COLUMNS = [
  // {
  //   key: "id",
  //   header: "شناسه",
  //   width: "w-14",
  //   cell: ({ id }) => (
  //     <span className="text-xs text-muted-foreground font-mono">#{id}</span>
  //   ),
  // },
  {
    key: "full_name",
    header: "نام مشتری",
    width: "w-44",
    sortable: true,
    cell: ({ full_name, phone }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{full_name}</span>
        <span className="text-xs text-muted-foreground font-mono ltr">
          {phone}
        </span>
      </div>
    ),
  },
  {
    key: "customer_type",
    header: "نوع مشتری",
    width: "w-28",
    cell: ({ customer_type }) => (
      <CustomerTypeBadge type={customer_type} size="sm" />
    ),
  },
  {
    key: "status",
    header: "وضعیت",
    width: "w-28",
    cell: ({ status }) => (
      <StatusBadge
        config={buildStatusConfig(CUSTOMER_STATUS_CONFIG, status)}
        size="sm"
        variant="soft"
      />
    ),
  },
  {
    key: "assigned_agent_name",
    header: "کارشناس مسئول",
    width: "w-36",
    cell: ({ assigned_agent_name }) => (
      <span className="text-sm">
        {assigned_agent_name || (
          <span className="text-muted-foreground text-xs">—</span>
        )}
      </span>
    ),
  },
  {
    key: "tags",
    header: "برچسب ها",
    width: "w-32",
    cell: ({ tags }) => {
      if (!tags || tags.length === 0)
        return (
          <span className="text-muted-foreground text-xs">—</span>
        );
      const shown = tags.slice(0, 2);
      const remaining = tags.length - shown.length;
      return (
        <div className="flex items-center gap-1 flex-wrap">
          {shown.map((t) => (
            <span
              key={t.id ?? t.name}
              className="text-[11px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
            >
              {t.name}
            </span>
          ))}
          {remaining > 0 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-muted/30 text-muted font-medium">
              +{remaining}
            </span>
          )}
        </div>
      );
    },
  },
  // {
  //   key: "source",
  //   header: "منبع",
  //   width: "w-28",
  //   cell: ({ source }) => <SourceBadge source={source} size="sm" />,
  // },
  {
    key: "created_at",
    header: "تاریخ ثبت",
    width: "w-28",
    sortable: true,
    cell: ({ created_at }) => formatDate(created_at, "short"),
  },
  // {
  //   key: "actions",
  //   header: "",
  //   width: "w-20",
  //   actions: true,
  // },
];
