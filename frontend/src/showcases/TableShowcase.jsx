import { useState, useEffect, useMemo } from "react";
import { Inbox, AlertCircle } from "lucide-react";

import Table from "@/shared/table/Table";
import TablePagination from "@/shared/table/TablePagination";
import TableActions from "@/shared/table/TableActions";
import StatusBadge from "@/shared/ui/StatusBadge";
import ScoreBadge from "@/shared/ui/ScoreBadge";
import Button from "@/shared/ui/Button";
import FilterBar from "@/shared/filters/FilterBar";
import useFilter from "@/shared/filters/useFilter";
import { LISTING_FILTERS, FILTER_OPTIONS } from "@/constants/filterConfig";

export default function TableShowcase() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const pageSize = 5;

  const {
    filters,
    setFilter,
    clearFilter,
    clearAll,
    activeChips,
    toQueryParams,
  } = useFilter(LISTING_FILTERS, FILTER_OPTIONS);

  // Fetch listings with filters
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        const query = toQueryParams();
        Object.entries(query).forEach(([k, v]) => params.append(k, v));
        const res = await fetch(`/api/listing/list/?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        if (!cancelled) setData(Array.isArray(json) ? json : json.data || []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true };
  }, [toQueryParams]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page]);

  const totalPages = Math.ceil(data.length / pageSize);

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={40} className="text-danger mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-1">خطا در دریافت داده</h3>
          <p className="text-sm text-muted mb-4">{error}</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-4">
      <h1 className="text-xl font-bold text-foreground tracking-tight">لیست آگهی‌ها</h1>

      <FilterBar
        schema={LISTING_FILTERS}
        options={FILTER_OPTIONS}
        filters={filters}
        onChange={setFilter}
        onClear={clearFilter}
        onClearAll={clearAll}
        activeChips={activeChips}
      />

      <Table
        loading={loading}
        emptyState={
          <Table.EmptyState
            icon={Inbox}
            title="آگهی‌ای یافت نشد"
            description="با فیلترهای انتخابی هیچ آگهی‌ای پیدا نشد."
            action={<Button variant="outline" size="sm" onClick={clearAll}>حذف فیلترها</Button>}
          />
        }
      >
        <Table.Header>
          <Table.Column>عنوان</Table.Column>
          <Table.Column align="center">وضعیت</Table.Column>
          <Table.Column align="center">امتیاز</Table.Column>
          <Table.Column>منطقه</Table.Column>
          <Table.Column>قیمت</Table.Column>
          <Table.Column align="center">سال/اتاق/طبقه</Table.Column>
          <Table.Column align="center">عملیات</Table.Column>
        </Table.Header>

        <Table.Body empty={!loading && paged.length === 0}>
          {paged.map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  {row.hs_picture ? (
                    <img src={row.hs_picture} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-(--role-subtle)/30 flex items-center justify-center text-muted text-xs">
                      بدون عکس
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-sm">{row.title}</div>
                    <div className="text-xs text-muted">{row.phone}</div>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell align="center">
                <StatusBadge status={row.status} type="property" variant="soft" size="sm" />
              </Table.Cell>
              <Table.Cell align="center">
                <ScoreBadge score={row.score} size="sm" showLabel={false} />
              </Table.Cell>
              <Table.Cell className="text-muted text-sm">{row.district?.name}</Table.Cell>
              <Table.Cell className="text-sm">
                {row.listed_sale_price ? (
                  <span>{new Intl.NumberFormat("fa-IR").format(row.listed_sale_price)} تومان</span>
                ) : row.listed_rent_amount ? (
                  <span>{new Intl.NumberFormat("fa-IR").format(row.listed_rent_amount)} تومان</span>
                ) : (
                  <span className="text-muted">توافقی</span>
                )}
                {row.price_per_meter_toman && (
                  <div className="text-[10px] text-muted">
                    هر متر: {new Intl.NumberFormat("fa-IR").format(row.price_per_meter_toman)}
                  </div>
                )}
              </Table.Cell>
              <Table.Cell align="center">
                <div className="flex items-center justify-center gap-1 text-xs text-muted">
                  <span className="px-1.5 py-0.5 rounded bg-(--role-subtle)/20">{row.build_year || "—"}</span>
                  <span className="px-1.5 py-0.5 rounded bg-(--role-subtle)/20">{row.room_count || "—"} خواب</span>
                  <span className="px-1.5 py-0.5 rounded bg-(--role-subtle)/20">طبقه {row.floor_number || "—"}</span>
                </div>
              </Table.Cell>
              <Table.Cell align="center">
                <TableActions
                  onView={() => console.log("view", row.id)}
                  onEdit={() => console.log("edit", row.id)}
                  onDelete={() => console.log("delete", row.id)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <TablePagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}