import { useMemo, useEffect, useState, useCallback } from "react";
import { Eye, Phone, ExternalLink, Inbox } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useListing from "@/features/listings/hooks/useListing";
import {
  LISTING_ALL_FILTERS,
  LISTING_TABLE_COLUMNS,
} from "@/features/listings/config";
import useDebounce from "@/shared/useDebounce";
import Button from "@/shared/ui/Button";
import ListingDetailModal from "@/features/listings/components/ListingDetailModal";
import RegisterCallForm from "../../../shared/forms/RegisterCallForm";

const LISTING_ROW_ACTIONS = [
  { key: "view", label: "مشاهده", icon: Eye },
  { key: "register_call", label: "ثبت تماس", icon: Phone },
  {
    key: "open_source",
    label: "مشاهده منبع",
    icon: ExternalLink,
    visible: (row) => !!row.url,
  },
];

export default function ListingsPage() {
  const { setPageHeader } = useOutletContext();

  const {
    data,
    loading,
    meta,
    filters: filterValues,
    setFilter,
    clearFilter,
    clearAll,
    activeChips,
    sort,
    setOrdering,
    page,
    setPage,
    pageSize,
    totalPages,
    getById,
  } = useListing();

  const [detailListing, setDetailListing] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [callListing, setCallListing] = useState(null);

  const [searchInput, setSearchInput] = useState(filterValues.search || "");
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (filterValues.search !== searchInput) {
      setSearchInput(filterValues.search || "");
    }
  }, [filterValues.search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (debouncedSearch !== filterValues.search) {
      setFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, filterValues.search, setFilter]);

  const handleSort = useCallback(
    (key) => {
      const dir = sort?.key === key && sort?.dir === "asc" ? "desc" : "asc";
      setOrdering(`${dir === "desc" ? "-" : ""}${key}`);
    },
    [sort, setOrdering],
  );

  const openDetail = useCallback(
    async (row) => {
      setDetailLoading(true);
      setDetailListing(row);
      try {
        if (getById) {
          const full = await getById(row.id);
          setDetailListing(full);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setDetailLoading(false);
      }
    },
    [getById],
  );

  const handleRowAction = useCallback(
    (actionKey, row) => {
      switch (actionKey) {
        case "view":
          openDetail(row);
          break;
        case "register_call":
          setCallListing(row);
          break;
        case "open_source":
          if (row.url) window.open(row.url, "_blank", "noopener,noreferrer");
          break;
        default:
          break;
      }
    },
    [openDetail],
  );

  const filters = useMemo(
    () => ({
      schema: (LISTING_ALL_FILTERS || []).filter((f) => f.type !== "search"),
      options: {},
      values: filterValues,
      onChange: setFilter,
      onClear: clearFilter,
      onClearAll: clearAll,
      chips: activeChips,
    }),
    [filterValues, setFilter, clearFilter, clearAll, activeChips],
  );

  const searchConfig = useMemo(
    () => ({
      value: searchInput,
      onChange: setSearchInput,
      placeholder: "جستجو در عنوان یا شناسه",
    }),
    [searchInput],
  );

  const pagination = useMemo(
    () => ({
      page,
      pageSize: pageSize || 20,
      total: meta?.count || 0,
      totalPages: totalPages?.(meta?.count || 0) || 1,
    }),
    [page, pageSize, meta?.count, totalPages],
  );

  useEffect(() => {
    setPageHeader({
      title: "آگهی‌ها",
      subtitle: "آگهی‌های استخراج‌شده از اسکراپر",
      breadcrumb: [],
    });
    return () => setPageHeader(null);
  }, [setPageHeader]);

  const emptyState = useMemo(
    () => (
      <div className="py-12 text-center space-y-3">
        <Inbox size={48} className="mx-auto text-muted/40" />
        <div>
          <p className="text-sm font-medium text-foreground">
            آگهی‌ای یافت نشد
          </p>
          <p className="text-xs text-muted mt-1">
            هنوز آگهی‌ای از اسکرپر وارد نشده یا با فیلتر فعلی نتیجه‌ای نیست.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={clearAll}>
          حذف فیلترها
        </Button>
      </div>
    ),
    [clearAll],
  );

  return (
    <>
      <ResourceTemplate
        search={searchConfig}
        filters={filters}
        count={meta?.count || 0}
        countLabel="آگهی"
        columns={LISTING_TABLE_COLUMNS}
        data={data}
        loading={loading}
        emptyState={emptyState}
        sort={sort}
        onSort={handleSort}
        selectable={false}
        rowActions={LISTING_ROW_ACTIONS}
        bulkActions={[]}
        onRowAction={handleRowAction}
        pagination={pagination}
        onPageChange={setPage}
      />

      <ListingDetailModal
        isOpen={!!detailListing}
        onClose={() => setDetailListing(null)}
        listing={detailListing}
        loading={detailLoading}
        onRegisterCall={(listing) => setCallListing(listing)}
      />

      <RegisterCallForm
        isOpen={!!callListing}
        onClose={() => setCallListing(null)}
        listing={callListing}
        onSuccess={() => setCallListing(null)}
      />
    </>
  );
}
