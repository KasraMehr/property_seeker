import { Link } from "react-router-dom";
import Table from "@/shared/table/Table";
import { formatPrice } from "@/utils/formatters";

const LEADS_COLUMNS = [
  {
    key: "title",
    header: "عنوان",
    cell: ({ title }) => (
      <p className="text-sm font-medium truncate max-w-48" title={title}>
        {title || "—"}
      </p>
    ),
  },
  {
    key: "price",
    header: "قیمت / اجاره",
    width: "w-36",
    cell: ({ listed_sale_price, listed_rent_amount }) => {
      if (listed_sale_price)
        return (
          <div className="flex flex-col">
            <span className="text-[11px] text-muted">فروش</span>
            <span className="text-sm font-medium text-emerald-600">
              {formatPrice(listed_sale_price)}
            </span>
          </div>
        );
      if (listed_rent_amount)
        return (
          <div className="flex flex-col">
            <span className="text-[11px] text-muted">اجاره</span>
            <span className="text-sm font-medium text-sky-600">
              {formatPrice(listed_rent_amount)}
            </span>
          </div>
        );
      return <span className="text-muted-foreground">—</span>;
    },
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
