import { useMemo, useEffect, useState, useCallback } from "react";
import { Eye, Phone, ExternalLink, Inbox } from "lucide-react";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useListing from "@/features/listings/hooks/useListing";
import {
  LISTING_ALL_FILTERS,
  LISTING_TABLE_COLUMNS,
} from "@/features/listings/config";
import useDebounce from "@/shared/useDebounce";
import Button from "@/shared/ui/Button";
import ListingDetailModal from "@/features/listings/components/ListingDetailModal";
import RegisterCallFromListingModal from "@/features/listings/components/RegisterCallFormListingModal";
import callService from "@/features/calls/services/callService";

/**
 *suppurted actions for listings
 */
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
    totalPages,
    getById,
    refresh,
  } = useListing();

  const [detailListing, setDetailListing] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [callListing, setCallListing] = useState(null);

  // ─── Search (client-side یا query؛ Backend فعلاً FilterSet ندارد) ───
  const [searchInput, setSearchInput] = useState(filterValues.search || "");
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (filterValues.search !== searchInput) {
      setSearchInput(filterValues.search || "");
    }
  }, [filterValues.search]);

  useEffect(() => {
    if (debouncedSearch !== filterValues.search) {
      setFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, filterValues.search, setFilter]);

  // ─── Sort ───
  const handleSort = useCallback(
    (key) => {
      const dir = sort?.key === key && sort?.dir === "asc" ? "desc" : "asc";
      setOrdering(`${dir === "desc" ? "-" : ""}${key}`);
    },
    [sort, setOrdering],
  );

  // ─── Open detail ───
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
        toast?.error?.("خطا در دریافت جزئیات آگهی") ||
          console.error(err);
      } finally {
        setDetailLoading(false);
      }
    },
    [getById],
  );

  // ─── Row actions ───
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

  // map for call log
  const mapCallPayload = useCallback((form, listing) => {
    const callTypeMap = {
      inbound: "incoming",
      incoming: "incoming",
      outbound: "outgoing",
      outgoing: "outgoing",
    };

    return {
      customer: form.customer,
      listing: listing?.id,
      call_type: callTypeMap[form.call_type] || form.call_type || "outgoing",
      result: form.result,
      note: form.note ?? form.notes ?? "",
      call_duration: Number(form.call_duration ?? form.duration ?? 0) || 0,
      called_at: form.called_at || new Date().toISOString(),
      next_follow_up_at: form.next_follow_up_at || form.nextDate || null,
      follow_up_done: Boolean(form.follow_up_done),
      ...(listing?.property
        ? {
            property:
              typeof listing.property === "object"
                ? listing.property.id
                : listing.property,
          }
        : {}),
    };
  }, []);

  const handleRegisterCallSubmit = useCallback(
    async (formData) => {
      if (!callListing?.id) return;

      const payload = mapCallPayload(formData, callListing);

      if (!payload.customer) {
        toast?.error?.("انتخاب مشتری الزامی است");
        throw new Error("customer required");
      }

      await callService.create(payload);
      toast?.success?.("تماس با موفقیت ثبت شد");
      setCallListing(null);
      // refresh?.();
    },
    [callListing, mapCallPayload],
  );

  const handleRegisterCallFromDetail = useCallback((listing) => {
    setCallListing(listing);
  }, []);

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
      placeholder: "جستجو در عنوان یا شناسه خارجی...",
    }),
    [searchInput],
  );

  const pagination = useMemo(
    () => ({
      page,
      pageSize: 25,
      total: meta?.count || 0,
      totalPages: totalPages?.(meta?.count || 0) || 1,
    }),
    [page, meta?.count, totalPages],
  );

  const customHeader = useMemo(
    () => (
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            آگهی‌ها
          </h1>
          <p className="text-sm text-muted mt-1">
            {(meta?.count || 0).toLocaleString("fa-IR")} آگهی
          </p>
        </div>
      </div>
    ),
    [meta?.count],
  );

  const emptyState = useMemo(
    () => (
      <div className="py-12 text-center space-y-3">
        <Inbox size={48} className="mx-auto text-muted/40" />
        <div>
          <p className="text-sm font-medium text-foreground">آگهی‌ای یافت نشد</p>
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
        header={customHeader}
        search={searchConfig}
        filters={filters}
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

      {/* Detail Serializer */}
      <ListingDetailModal
        isOpen={!!detailListing}
        onClose={() => setDetailListing(null)}
        listing={detailListing}
        loading={detailLoading}
        onRegisterCall={handleRegisterCallFromDetail}
      />

      {/* call log with listing-id*/}
      <RegisterCallFromListingModal
        isOpen={!!callListing}
        onClose={() => setCallListing(null)}
        listing={callListing}
        onSuccess={() => {
          setCallListing(null);
        }}
        onSubmit={handleRegisterCallSubmit}
      />
    </>
  );
}