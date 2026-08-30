import { Link } from "react-router-dom";
import Table from "@/shared/table/Table";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { buildStatusConfig } from "@/constants/status.utils";
import { LISTING_STATUS_CONFIG } from "@/features/listings/config";
import { formatDate } from "@/utils/formatters";

const LEADS_COLUMNS = [
  {
    key: "title",
    header: "عنوان",
    cell: ({ title, source }) => (
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted">{source?.name || "—"}</p>
      </div>
    ),
  },
  {
    key: "status",
    header: "وضعیت آگهی",
    width: "w-24",
    cell: ({ status }) => (
      <StatusBadge
        config={buildStatusConfig(LISTING_STATUS_CONFIG, status)}
        variant="soft"
        size="sm"
      />
    ),
  },
  {
    key: "published_at",
    header: "تاریخ انتشار",
    width: "w-28",
    cell: ({ published_at }) => (
      <span className="text-sm">{formatDate(published_at, "short")}</span>
    ),
  },
];

export default function MyRecentLeadsWidget({ leads, loading }) {
  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-4 flex flex-col h-105">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-lg font-bold text-foreground">آگهی های اخیر من</h2>
        <Link to="/operator/listings" className="text-sm text-primary hover:underline">
          مشاهده همه
        </Link>
      </div>

      <div className="overflow-auto rounded-xl border border-border flex-1 min-h-0">
        <Table
          data={leads.slice(0, 5)}
          columns={LEADS_COLUMNS}
          loading={loading}
        />
      </div>
    </div>
  );
}
