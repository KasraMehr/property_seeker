import StatusBadge from "@/shared/ui/badges/StatusBadge";
import {
  INGESTION_RUN_STATUS_CONFIG,
  INGESTION_RUN_MODE_CONFIG,
} from "@/features/scraper-management/config";
import {buildStatusConfig } from "@/constants/status.utils"
import { formatDate } from "@/utils/formatters";

/**
 * ingestionRun Table Columns
 * Backend: ingestion.ingestionRun
 */
export const SCRAPER_RUN_TABLE_COLUMNS = [
  // {
  //   key: "id",
  //   header: "شناسه اجرا",
  //   width: "w-36",
  //   cell: ({ id }) => (
  //     <span
  //       className="text-xs font-mono text-muted-foreground truncate max-w-30"
  //       title={id}
  //     >
  //       {id?.slice(0, 8)}...
  //     </span>
  //   ),
  // },
  {
    key: "target",
    header: "تارگت",
    width: "w-32",
    cell: ({ target }) => (
      <span className="text-sm font-medium">{target?.name || "—"}</span>
    ),
  },
  {
    key: "mode",
    header: "حالت",
    width: "w-24",
    filterKey: "mode",
    cell: ({ mode }) => {
      const cfg = INGESTION_RUN_MODE_CONFIG[mode];
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
    key: "status",
    header: "وضعیت",
    width: "w-24",
    filterKey: "status",
    cell: ({ status }) => (
      <StatusBadge
        config={buildStatusConfig(INGESTION_RUN_STATUS_CONFIG, status)}
      />
    ),
  },
  {
    key: "discovered",
    header: "کشف / پردازش",
    width: "w-32",
    cell: ({ discovered_count, processed_count, new_count, changed_count }) => (
      <div className="flex flex-col text-xs">
        <span className="text-muted-foreground">
          {processed_count || 0} / {discovered_count || 0} پردازش
        </span>
        <span className="text-emerald-600">{new_count || 0} جدید</span>
        <span className="text-sky-600">{changed_count || 0} تغییر</span>
      </div>
    ),
  },
  {
    key: "failed",
    header: "خطا",
    width: "w-16",
    cell: ({ failed_count }) =>
      failed_count > 0 ? (
        <span className="text-xs font-bold text-danger">{failed_count}</span>
      ) : (
        <span className="text-xs text-muted-foreground">0</span>
      ),
  },
  {
    key: "started_at",
    header: "شروع",
    width: "w-28",
    cell: ({ started_at }) => formatDate(started_at, "short"),
  },
  {
    key: "finished_at",
    header: "پایان",
    width: "w-28",
    cell: ({ finished_at, status }) => {
      if (!finished_at)
        return <span className="text-xs text-amber-600">در حال اجرا...</span>;
      return formatDate(finished_at, "short");
    },
  },
  // {
  //   key: "actions",
  //   header: "",
  //   width: "w-20",
  //   actions: true,
  // },
];
