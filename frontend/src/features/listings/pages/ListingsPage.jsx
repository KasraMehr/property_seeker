import { useMemo, useEffect, useState, useCallback } from "react";
import { Inbox } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
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
import RegisterCallForm from "../../../shared/forms/RegisterCallForm";

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
  } = useListing();

  const {
    detail,
    promote,
    registerCall,
    openDetail,
    closeDetail,
    openPromote,
    closePromote,
    openRegisterCall,
    closeRegisterCall,
  } = useListingModals();

  const [detailLoading, setDetailLoading] = useState(false);
  const [promoteResult, setPromoteResult] = useState(null);

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
      // Fetch full listing detail so auto-fill fields are available
      try {
        const full = await getById(row.id);
        openPromote(full?.data ?? full);
      } catch (err) {
        console.error(err);
        // Fallback: open with whatever data we have
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
        case "open_source":
          if (row.url) window.open(row.url, "_blank", "noopener,noreferrer");
          break;
        default:
          break;
      }
    },
    [handleOpenDetail, openRegisterCall, handleOpenPromote],
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
      />

      <RegisterCallForm
        isOpen={registerCall.open}
        onClose={closeRegisterCall}
        listing={registerCall.listing}
        onSuccess={() => closeRegisterCall()}
      />
    </>
  );
}
