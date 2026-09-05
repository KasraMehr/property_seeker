import { Link } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import Table from "@/shared/table/Table";
import { formatDateTime } from "@/utils/formatters";

const isToday = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr).toDateString() === new Date().toDateString();
};

const isOverdue = (dateStr, status) => {
  if (!dateStr || status !== "pending") return false;
  const d = new Date(dateStr);
  return d < new Date() && !isToday(dateStr);
};

const FOLLOWUP_COLUMNS = [
  {
    key: "title",
    header: "عنوان",
    width: "w-1/2",
    cell: ({ title, description, due_at, status }) => (
      <div className="flex items-center gap-1.5">
        {isToday(due_at) && status === "pending" && (
          <span className="shrink-0 w-2 h-2 rounded-full bg-amber-500" title="موعد امروز" />
        )}
        <div>
          <p className="text-sm font-medium">{title}</p>
          {/* <p className="text-xs text-muted line-clamp-1">{description || "—"}</p> */}
        </div>
      </div>
    ),
  },
  {
    key: "due_at",
    header: "تاریخ",
    width: "w-32",
    cell: ({ due_at, status }) => (
      <span
        className={`text-sm flex items-center justify-center gap-1 ${
          isOverdue(due_at, status)
            ? "text-danger font-semibold"
            : isToday(due_at) && status === "pending"
              ? "text-amber-600 font-semibold"
              : ""
        }`}
      >
        <CalendarCheck className="w-3.5 h-3.5" />
        {formatDateTime(due_at)}
        {isOverdue(due_at, status) && (
          <span className="text-xs text-danger">(گذشته)</span>
        )}
        {isToday(due_at) && status === "pending" && (
          <span className="text-xs text-amber-600">(امروز)</span>
        )}
      </span>
    ),
  },
];

export default function PendingFollowupsWidget({ followups, loading }) {
  const pending = followups
    .filter((f) => f.status === "pending")
    .sort((a, b) => {
      const aToday = isToday(a.due_at) ? 0 : 1;
      const bToday = isToday(b.due_at) ? 0 : 1;
      if (aToday !== bToday) return aToday - bToday;
      return new Date(a.due_at) - new Date(b.due_at);
    })
    .slice(0, 5);

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
