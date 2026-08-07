import { Link } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import Table from "@/shared/table/Table";
import StatusBadge from "@/shared/ui/badges/StatusBadge";

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("fa-IR") : "—");

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
        <Table loading={loading}>
          <Table.Header>
            <Table.Column align="right">عنوان</Table.Column>
            <Table.Column align="center" width="120px">تاریخ</Table.Column>
            <Table.Column align="center" width="100px">وضعیت</Table.Column>
          </Table.Header>
          <Table.Body>
            {pending.map((f) => (
              <Table.Row key={f.id}>
                <Table.Cell align="right">
                  <div>
                    <p className="text-sm font-medium">{f.title}</p>
                    <p className="text-xs text-muted line-clamp-1">{f.description || "—"}</p>
                  </div>
                </Table.Cell>
                <Table.Cell align="center">
                  <span className="text-sm flex items-center justify-center gap-1">
                    <CalendarCheck className="w-3.5 h-3.5 text-muted" />
                    {fmtDate(f.due_at)}
                  </span>
                </Table.Cell>
                <Table.Cell align="center">
                  <StatusBadge status={f.status} type="followup" variant="soft" size="sm" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}