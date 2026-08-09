import  StatusBadge  from "@/shared/ui/badges/StatusBadge";
import { SCRAPE_TARGET_STATUS_CONFIG } from "@/features/scraper-management/config";
import { formatDate } from "@/utils/formatters";
import { Clock, Link2 } from "lucide-react";

/**
 * ScrapeTarget Table Columns
 * Backend: ingestion.ScrapeTarget
 */
export const SCRAPER_TARGET_TABLE_COLUMNS = [
  {
    key: "id",
    header: "شناسه",
    width: "w-14",
    cell: ({ id }) => <span className="text-xs text-muted-foreground font-mono">#{id}</span>,
  },
  {
    key: "name",
    header: "نام تارگت",
    width: "w-48",
    searchable: true,
    cell: ({ name, search_url }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{name}</span>
        <a href={search_url} target="_blank" rel="noreferrer" className="text-xs text-primary truncate max-w-50 inline-flex items-center gap-1">
          <Link2 className="w-3 h-3" />
          {search_url}
        </a>
      </div>
    ),
  },
  {
    key: "source",
    header: "منبع",
    width: "w-28",
    cell: ({ source }) => (
      <span className="text-sm">{source?.name || "—"}</span>
    ),
  },
  {
    key: "enabled",
    header: "وضعیت",
    width: "w-24",
    filterKey: "enabled",
    cell: ({ enabled }) => (
      <StatusBadge status={enabled ? "enabled" : "disabled"} config={SCRAPE_TARGET_STATUS_CONFIG} />
    ),
  },
  {
    key: "interval",
    header: "فاصله زمانی",
    width: "w-28",
    cell: ({ discovery_interval_minutes }) => (
      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        {discovery_interval_minutes || 15} دقیقه
      </span>
    ),
  },
  {
    key: "last_discovery",
    header: "آخرین کشف",
    width: "w-32",
    cell: ({ last_discovery_at }) => formatDate(last_discovery_at, "short"),
  },
  {
    key: "last_full",
    header: "آخرین کشف کامل",
    width: "w-32",
    cell: ({ last_full_discovery_at }) => formatDate(last_full_discovery_at, "short"),
  },
  {
    key: "actions",
    header: "",
    width: "w-20",
    actions: true,
  },
];