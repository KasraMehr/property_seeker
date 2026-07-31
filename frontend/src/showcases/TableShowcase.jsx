import { useState, useMemo, useEffect } from "react";
import { Inbox, Plus } from "lucide-react";

import Table from "@/shared/table/Table";
import TablePagination from "@/shared/table/TablePagination";
import TableActions from "@/shared/table/TableActions";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import ScoreBadge from "@/shared/ui/badges/ScoreBadge";
import Button from "@/shared/ui/Button";
import SearchBox from "@/shared/ui/SearchBox";
import FilterBar from "@/shared/filters/FilterBar";
import useFilter from "@/shared/filters/useFilter";
import { LISTING_FILTERS, FILTER_OPTIONS } from "@/constants/filterConfig";

// Filter schema 
const FILTER_SCHEMA_NO_SEARCH = LISTING_FILTERS.filter((f) => f.key !== "search");

// Helpers
const fmtPrice = (row) => {
  if (row.listed_sale_price) {
    if (row.listed_sale_price >= 1_000_000_000)
      return `${(row.listed_sale_price / 1_000_000_000).toFixed(1)} میلیارد`;
    return `${(row.listed_sale_price / 1_000_000).toFixed(0)} میلیون`;
  }
  if (row.listed_rent_amount) {
    const rent = `${(row.listed_rent_amount / 1_000_000).toFixed(1)} میلیون`;
    const deposit = row.deposit_toman || row.listed_deposit_amount;
    if (deposit) {
      const depositFmt =
        deposit >= 1_000_000_000
          ? `${(deposit / 1_000_000_000).toFixed(1)} میلیارد`
          : `${(deposit / 1_000_000).toFixed(0)} میلیون`;
      return `ودیعه ${depositFmt} / اجاره ${rent}`;
    }
    return `${rent} اجاره`;
  }
  return "—";
};

const fmtYearRoomsFloor = (row) =>
  `${row.build_year} / ${row.room_count}خ / ط${row.floor_number}`;

export default function TableShowcase() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const pageSize = 5;

  const {
    filters,
    setFilter,
    clearFilter,
    clearAll,
    activeChips,
    toQueryParams,
  } = useFilter(LISTING_FILTERS, FILTER_OPTIONS);

  // SearchBox has built-in debounce 
  const handleSearch = (debouncedValue) => {
    setFilter("search", debouncedValue || "");
  };

  // Query string for fetch 
  const fetchQueryString = useMemo(() => {
    const params = toQueryParams();
    return new URLSearchParams(params).toString();
  }, [toQueryParams]);

  // Fetch via MSW (or real API later) 
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/listing/list/?${fetchQueryString}`);
        if (!res.ok) throw new Error("خطا در دریافت داده‌ها");
        const json = await res.json();
        if (!cancelled) {
          setData(Array.isArray(json) ? json : json.data || []);
          setPage(1);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [fetchQueryString]);

  // Pagination (client-side on fetched data)
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page]);

  const totalPages = Math.ceil(data.length / pageSize) || 1;

  // Selection
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const allSelected =
    paged.length > 0 && paged.every((r) => selected.includes(r.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) =>
        prev.filter((id) => !paged.find((r) => r.id === id)),
      );
    } else {
      setSelected((prev) => [...new Set([...prev, ...paged.map((r) => r.id)])]);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-danger font-medium">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            لیست آگهی‌ها
          </h1>
          <p className="text-sm text-muted mt-1">
            {data.length.toLocaleString("fa-IR")} آگهی
          </p>
        </div>
        <Button variant="primary" size="sm" className="gap-1.5">
          <Plus size={16} />
          آگهی جدید
        </Button>
      </div>

      {/* Independent SearchBox*/}
      <SearchBox
        label="جستجو"
        placeholder="عنوان، شماره تلفن، توضیحات..."
        debounce={400}
        onSearch={handleSearch}
        className="max-w-md"
      />

      {/* FilterBar without search field */}
      <FilterBar
        schema={FILTER_SCHEMA_NO_SEARCH}
        options={FILTER_OPTIONS}
        filters={filters}
        onChange={setFilter}
        onClear={clearFilter}
        onClearAll={clearAll}
        activeChips={activeChips}
      />

      {/* Table */}
      <Table
        loading={loading}
        emptyState={
          <Table.EmptyState
            icon={Inbox}
            title="آگهی‌ای یافت نشد"
            description="با فیلترهای انتخابی هیچ آگهی‌ای پیدا نشد."
            action={
              <Button variant="outline" size="sm" onClick={clearAll}>
                حذف فیلترها
              </Button>
            }
          />
        }
      >
        <Table.Header>
          <Table.Column align="center" width="48px">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="w-4 h-4 rounded border-border text-(--role-primary) focus:ring-(--role-primary)/20"
            />
          </Table.Column>
          <Table.Column>عنوان</Table.Column>
          <Table.Column align="center">وضعیت</Table.Column>
          <Table.Column align="center">امتیاز</Table.Column>
          <Table.Column>منطقه</Table.Column>
          <Table.Column>قیمت</Table.Column>
          <Table.Column align="center">سال / اتاق / طبقه</Table.Column>
          <Table.Column align="center">عملیات</Table.Column>
        </Table.Header>

        <Table.Body empty={!loading && paged.length === 0}>
          {paged.map((row) => (
            <Table.Row key={row.id} selected={selected.includes(row.id)}>
              <Table.Cell align="center">
                <input
                  type="checkbox"
                  checked={selected.includes(row.id)}
                  onChange={() => toggleSelect(row.id)}
                  className="w-4 h-4 rounded border-border text-(--role-primary) focus:ring-(--role-primary)/20"
                />
              </Table.Cell>

              <Table.Cell>
                <div className="flex items-center gap-3">
                  {row.hs_picture ? (
                    <img
                      src={row.hs_picture}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-(--role-subtle)/30 flex items-center justify-center text-muted text-xs shrink-0">
                      بدون عکس
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                      {row.title}
                    </div>
                    <div className="text-xs text-muted">{row.phone}</div>
                  </div>
                </div>
              </Table.Cell>

              <Table.Cell align="center">
                <StatusBadge
                  status={row.status}
                  type="property"
                  variant="soft"
                  size="sm"
                />
              </Table.Cell>

              <Table.Cell align="center">
                <ScoreBadge score={row.score} size="sm" showLabel={false} />
              </Table.Cell>

              <Table.Cell>
                <span className="text-sm text-foreground">
                  {row.district?.name}
                </span>
              </Table.Cell>

              <Table.Cell>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {fmtPrice(row)}
                  </span>
                  {row.price_per_meter_toman && (
                    <span className="text-[10px] text-muted">
                      متر:{" "}
                      {new Intl.NumberFormat("fa-IR").format(
                        row.price_per_meter_toman,
                      )}
                    </span>
                  )}
                </div>
              </Table.Cell>

              <Table.Cell align="center">
                <span className="text-xs text-muted font-mono">
                  {fmtYearRoomsFloor(row)}
                </span>
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

      {/* Pagination */}
      <TablePagination
        page={page}
        totalPages={totalPages}
        onChange={setPage}
      />
    </div>
  );
}