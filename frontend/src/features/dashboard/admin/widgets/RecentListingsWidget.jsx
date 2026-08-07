import { Link } from "react-router-dom";
import Table from "@/shared/table/Table";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import ScoreBadge from "@/shared/ui/badges/ScoreBadge";

export default function RecentListingsWidget({ listings, loading }) {
  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">آخرین لیدها</h2>
        <Link
          to="/admin/listings"
          className="text-sm text-primary hover:underline"
        >
          مشاهده همه
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table loading={loading}>
          <Table.Header>
            <Table.Column align="right">عنوان</Table.Column>
            <Table.Column align="center" width="100px">
              وضعیت
            </Table.Column>
            <Table.Column align="center" width="80px">
              امتیاز
            </Table.Column>
            <Table.Column align="right" width="140px">
              منطقه
            </Table.Column>
            <Table.Column align="right" width="140px">
              قیمت
            </Table.Column>
          </Table.Header>
          <Table.Body>
            {listings.slice(0, 5).map((l) => (
              <Table.Row key={l.id}>
                <Table.Cell align="right">
                  <div>
                    <p className="text-sm font-medium">{l.title}</p>
                    <p className="text-xs text-muted">{l.phone || "—"}</p>
                  </div>
                </Table.Cell>
                <Table.Cell align="center">
                  <StatusBadge
                    status={l.status}
                    type="property"
                    variant="soft"
                    size="sm"
                  />
                </Table.Cell>
                <Table.Cell align="center">
                  <ScoreBadge score={l.score} size="sm" />
                </Table.Cell>
                <Table.Cell align="right">
                  <span className="text-sm">{l.district?.name || "—"}</span>
                </Table.Cell>
                <Table.Cell align="right">
                  <span className="text-sm font-medium">
                    {l.listed_sale_price
                      ? `${(l.listed_sale_price / 1_000_000).toFixed(0)} میلیون`
                      : "—"}
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}