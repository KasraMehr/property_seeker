import { useMemo, useEffect, useState, useCallback } from "react";
import { Inbox } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import PageTabs from "@/shared/page/PageTabs";
import useListing from "@/features/listings/hooks/useListing";
import useListingModals from "@/features/listings/hooks/useListingModals";
import {
  LISTING_ALL_FILTERS,
  LISTING_TABLE_COLUMNS,
  LISTING_ROW_ACTIONS,
} from "@/features/listings/config";
import useDebounce from "@/shared/useDebounce";
import Button from "@/shared/ui/Button";
import ListingDetailModal from "@/features/listings/components/ListingDetailModal";
import PromoteListingModal from "@/features/listings/components/PromoteListingModal";
import PromoteSuccessModal from "@/features/listings/components/PromoteSuccessModal";
import ChangeReviewStatusModal from "@/features/listings/components/ChangeReviewStatusModal";
import PropertyDetailModal from "@/features/properties/components/PropertyDetailModal";
import CallFormModal from "@/features/calls/components/CallFormModal";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import api from "@/lib/api";

/** Tabs map to server-side advertiser_type filter */
const LISTING_TABS = [
  { id: "all", label: "همه آگهی‌ها" },
  { id: "agency", label: "آژانس املاک" },
  { id: "owner", label: "آگهی‌های شخصی" },
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
    refresh,
    advertiserType,
    setAdvertiserType,
  } = useListing();

  const {
    detail,
    promote,
    registerCall,
    reviewStatus,
    openDetail,
    closeDetail,
    openPromote,
    closePromote,
    openRegisterCall,
    closeRegisterCall,
    openReviewStatus,
    closeReviewStatus,
  } = useListingModals();

  const [detailLoading, setDetailLoading] = useState(false);
  const [promoteResult, setPromoteResult] = useState(null);
  const [viewProperty, setViewProperty] = useState(null);

  // ─── Tab → advertiser_type (server-side) ───
  const handleTabChange = useCallback(
    (tabId) => {
      setAdvertiserType(tabId === "all" ? null : tabId);
    },
    [setAdvertiserType],
  );

  // ─── Tab badge counts from server ───
  const [tabCounts, setTabCounts] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadCounts() {
      try {
        const res = await api.get(API_ENDPOINTS.LISTINGS.COUNTS.url);
        if (!cancelled) setTabCounts(res.data);
      } catch {
        // silent — badges stay empty
      }
    }
    loadCounts();
    return () => { cancelled = true; };
  }, []);

  // Refresh counts after data mutations (refresh changes table count)
  useEffect(() => {
    if (meta?.count != null) {
      let cancelled = false;
      api.get(API_ENDPOINTS.LISTINGS.COUNTS.url)
        .then((res) => { if (!cancelled) setTabCounts(res.data); })
        .catch(() => {});
      return () => { cancelled = true; };
    }
  }, [meta?.count]);

  const tabItems = useMemo(
    () => LISTING_TABS.map((t) => ({
      ...t,
      badge: tabCounts ? (tabCounts[t.id] ?? 0) : undefined,
    })),
    [tabCounts],
  );

  // ─── Search ───
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

  // ─── Async filter options ───
  const [filterOptions, setFilterOptions] = useState({});

  useEffect(() => {
    // No async filter endpoints needed yet (source list endpoint doesn't exist)
    // Placeholder for future async filters
  }, []);

  // ─── Sort ───
  const handleSort = useCallback(
    (key) => {
      const dir = sort?.key === key && sort?.dir === "asc" ? "desc" : "asc";
      setOrdering(`${dir === "desc" ? "-" : ""}${key}`);
    },
    [sort, setOrdering],
  );

  // ─── Row actions ───
  const handleOpenDetail = useCallback(
    async (row) => {
      setDetailLoading(true);
      openDetail(row);
      try {
        if (getById) {
          const full = await getById(row.id);
          openDetail(full);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setDetailLoading(false);
      }
    },
    [getById, openDetail],
  );

  const handleOpenPromote = useCallback(
    async (row) => {
      try {
        const full = await getById(row.id);
        openPromote(full?.data ?? full);
      } catch (err) {
        console.error(err);
        openPromote(row);
      }
    },
    [getById, openPromote],
  );

  const handleRowAction = useCallback(
    (actionKey, row) => {
      switch (actionKey) {
        case "view":
          handleOpenDetail(row);
          break;
        case "register_call":
          openRegisterCall(row);
          break;
        case "promote":
          handleOpenPromote(row);
          break;
        case "change_review_status":
          openReviewStatus(row);
          break;
        case "open_source":
          if (row.url) window.open(row.url, "_blank", "noopener,noreferrer");
          break;
        default:
          break;
      }
    },
    [handleOpenDetail, openRegisterCall, handleOpenPromote, openReviewStatus],
  );

  // ─── Filters ───
  const filters = useMemo(
    () => ({
      schema: (LISTING_ALL_FILTERS || []).filter((f) => f.type !== "search"),
      options: filterOptions,
      values: filterValues,
      onChange: setFilter,
      onClear: clearFilter,
      onClearAll: clearAll,
      activeChips,
    }),
    [filterValues, setFilter, clearFilter, clearAll, activeChips, filterOptions],
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
      pageSize: pageSize || 10,
      total: meta?.count || 0,
      totalPages: totalPages?.(meta?.count || 0) || 1,
    }),
    [page, pageSize, meta?.count, totalPages],
  );

  useEffect(() => {
    setPageHeader({
      title: "آگهی‌ها",
      subtitle: "آگهی‌های استخراج‌شده",
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
      <div className="mb-4">
        <PageTabs
          items={tabItems}
          value={advertiserType ?? "all"}
          onChange={handleTabChange}
        />
      </div>
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
        isOpen={detail.open}
        onClose={closeDetail}
        listing={detail.listing}
        loading={detailLoading}
        onRegisterCall={(listing) => openRegisterCall(listing)}
      />

      <PromoteListingModal
        isOpen={promote.open}
        onClose={closePromote}
        listing={promote.listing}
        onSuccess={(result) => {
          closePromote();
          setPromoteResult(result);
          refresh?.();
        }}
      />

      <PromoteSuccessModal
        isOpen={!!promoteResult}
        onClose={() => setPromoteResult(null)}
        result={promoteResult}
        onViewProperty={(property) => {
          setPromoteResult(null);
          setViewProperty(property);
        }}
      />

      <PropertyDetailModal
        isOpen={!!viewProperty}
        onClose={() => setViewProperty(null)}
        property={viewProperty}
      />

      <ChangeReviewStatusModal
        isOpen={reviewStatus.open}
        onClose={closeReviewStatus}
        listings={reviewStatus.listing ? [reviewStatus.listing] : []}
        onSuccess={() => {
          closeReviewStatus();
          refresh?.();
        }}
      />

      <CallFormModal
        isOpen={registerCall.open}
        onClose={closeRegisterCall}
        extraData={{ listing: registerCall.listing }}
        onSuccess={() => closeRegisterCall()}
      />
    </>
  );
}
