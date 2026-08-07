import { Link } from "react-router-dom";
import Table from "@/shared/table/Table";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import ScoreBadge from "@/shared/ui/badges/ScoreBadge";

export default function MyRecentLeadsWidget({ leads, loading }) {
  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-4 flex flex-col h-105">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-lg font-bold text-foreground">لیدهای اخیر من</h2>
        <Link to="/operator/listings" className="text-sm text-primary hover:underline">
          مشاهده همه
        </Link>
      </div>

      <div className="overflow-auto rounded-xl border border-border flex-1 min-h-0">
        <Table loading={loading}>
          <Table.Header>
            <Table.Column align="right">عنوان</Table.Column>
            <Table.Column align="center" width="100px">وضعیت</Table.Column>
            <Table.Column align="center" width="80px">امتیاز</Table.Column>
          </Table.Header>
          <Table.Body>
            {leads.slice(0, 5).map((l) => (
              <Table.Row key={l.id}>
                <Table.Cell align="right">
                  <div>
                    <p className="text-sm font-medium">{l.title}</p>
                    <p className="text-xs text-muted">{l.district?.name || l.source?.name || "—"}</p>
                  </div>
                </Table.Cell>
                <Table.Cell align="center">
                  <StatusBadge status={l.status} type="property" variant="soft" size="sm" />
                </Table.Cell>
                <Table.Cell align="center">
                  <ScoreBadge score={l.score ?? 0} size="sm" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}