import { Link } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import Table from "@/shared/table/Table";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { buildStatusConfig } from "@/constants/status.utils";
import { FOLLOWUP_STATUS_CONFIG } from "@/features/followups/config";
import { formatDateTime } from "@/utils/formatters";

const FOLLOWUP_COLUMNS = [
  {
    key: "title",
    header: "عنوان",
    cell: ({ title, description }) => (
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted line-clamp-1">{description || "—"}</p>
      </div>
    ),
  },
  {
    key: "due_at",
    header: "تاریخ",
    width: "w-32",
    cell: ({ due_at }) => (
      <span className="text-sm flex items-center justify-center gap-1">
        <CalendarCheck className="w-3.5 h-3.5 text-muted" />
        {formatDateTime(due_at)}
      </span>
    ),
  },
  {
    key: "status",
    header: "وضعیت",
    width: "w-28",
    cell: ({ status }) => (
      <StatusBadge
        config={buildStatusConfig(FOLLOWUP_STATUS_CONFIG, status)}
        variant="soft"
        size="sm"
      />
    ),
  },
];

export default function PendingFollowupsWidget({ followups, loading }) {
  const pending = followups.filter((f) => f.status === "pending").slice(0, 5);

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-4 flex flex-col h-105">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-lg font-bold text-foreground">پیگیری‌های در انتظار</h2>
        <Link to="/operator/followups" className="text-sm text-primary hover:underline">
          مشاهده همه
        </Link>
      </div>

      <div className="overflow-auto rounded-xl border border-border flex-1 min-h-0">
        <Table
          data={pending}
          columns={FOLLOWUP_COLUMNS}
          loading={loading}
        />
      </div>
    </div>
  );
}
