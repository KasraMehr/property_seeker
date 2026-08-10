import { useMemo, useEffect, useState, useCallback } from "react";
import {
  Plus,
  Eye,
  Phone,
  Calendar,
  Trash2,
  ExternalLink,
  UserPlus,
  Inbox,
} from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useListing from "@/features/listings/hooks/useListing";
import {
  LISTING_ALL_FILTERS,
  LISTING_STATUS_CONFIG,
  LISTING_TABLE_COLUMNS 
} from "@/features/listings/config";
import RegisterCallForm from "@/shared/forms/RegisterCallForm";
import { buildStatusConfig } from "@/constants/status.utils";
import useDebounce from "@/shared/useDebounce";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import Button from "@/shared/ui/Button";
import ListingDetailModal from "@/features/listings/components/ListingDetailModal";
import AssignOperatorModal from "@/features/listings/components/AssignOperatorModal";

const LISTING_ROW_ACTIONS = {
  admin: [
    { key: "view", label: "مشاهده", icon: Eye },
    { key: "assign", label: "تخصیص به کارشناس", icon: UserPlus },
    {
      key: "sourceLink",
      label: "مشاهده در منبع",
      icon: ExternalLink,
      visible: (row) => !!row.url,
    },
    { key: "delete", label: "حذف", icon: Trash2, variant: "danger" },
  ],
  operator: [
    { key: "view", label: "مشاهده", icon: Eye },
    { key: "call", label: "ثبت تماس", icon: Phone },
    { key: "followup", label: "پیگیری", icon: Calendar },
  ],
};

const LISTING_BULK_ACTIONS = [
  { key: "bulkDelete", label: "حذف گروهی", icon: Trash2, variant: "danger" },
];

export default function ListingsPage() {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.is_owner);
  const role = isAdmin ? "admin" : "operator";

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
    remove,
  } = useListing();

  const [selected, setSelected] = useState([]);
  const [detailListing, setDetailListing] = useState(null);
  const [assignListingId, setAssignListingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  // ─── Debounced search state ───
  const [searchInput, setSearchInput] = useState(filterValues.search || "");
  const debouncedSearch = useDebounce(searchInput, 400);

  const [callListing, setCallListing] = useState(null);

  // Sync external clear → input
  useEffect(() => {
    if (filterValues.search !== searchInput) {
      setSearchInput(filterValues.search || "");
    }
  }, [filterValues.search]);

  // Debounced search → API (only when value actually changes)
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

  // ─── Row actions ───
  const handleRowAction = useCallback((actionKey, row) => {
    switch (actionKey) {
      case "view":
        setDetailListing(row);
        break;
      case "assign":
        setAssignListingId(row.id);
        break;
      case "sourceLink":
        if (row.url) window.open(row.url, "_blank");
        break;
      case "delete":
        setPendingDelete(row);
        break;
      case "call":
      case "followup":
        console.log(actionKey, row.id);
        break;
      default:
        break;
    }
  }, []);

  // ─── Bulk actions ───
  const handleBulkAction = useCallback(
    (actionKey) => {
      if (actionKey === "bulkDelete") {
        console.log("bulk delete", selected);
      }
    },
    [selected],
  );

  // ─── Delete confirm ───
  const confirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    await remove(pendingDelete.id);
    setPendingDelete(null);
    setSelected((prev) => prev.filter((id) => id !== pendingDelete.id));
  }, [pendingDelete, remove]);

  // ─── Filter options ───
  const filterOptions = useMemo(() => {
    const statusFilter = LISTING_ALL_FILTERS.find((f) => f.key === "status");
    const sourceFilter = LISTING_ALL_FILTERS.find((f) => f.key === "source");
    const userFilter = LISTING_ALL_FILTERS.find((f) => f.key === "created_by");
    return {
      statuses: statusFilter?.options || [],
      sources: sourceFilter?.options || [],
      users: userFilter?.options || [],
    };
  }, []);

  // FilterBar schema excludes search (handled by SearchBox)
  const filters = useMemo(
    () => ({
      schema: LISTING_ALL_FILTERS.filter((f) => f.type !== "search"),
      options: filterOptions,
      values: filterValues,
      onChange: setFilter,
      onClear: clearFilter,
      onClearAll: clearAll,
      activeChips,
    }),
    [
      filterOptions,
      filterValues,
      setFilter,
      clearFilter,
      clearAll,
      activeChips,
    ],
  );

  // ─── Pagination ───
  const pagination = useMemo(
    () => ({
      page,
      totalPages: totalPages(meta?.count),
    }),
    [page, meta?.count, totalPages],
  );

  const searchConfig = useMemo(
    () => ({
      value: searchInput,
      onChange: setSearchInput,
      label: "جستجو",
      placeholder: "عنوان، شماره تلفن، توضیحات...",
    }),
    [searchInput],
  );

  // ─── Custom header ───
  const customHeader = useMemo(
    () => (
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            مدیریت آگهی‌ها
          </h1>
          <p className="text-sm text-muted mt-1">
            {(meta?.count || 0).toLocaleString("fa-IR")} آگهی
            {selected.length > 0 && (
              <span className="mr-2 text-(--role-primary)">
                ({selected.length.toLocaleString("fa-IR")} انتخاب شده)
              </span>
            )}
          </p>
        </div>
      </div>
    ),
    [meta?.count, selected.length],
  );

  // ─── Empty state ───
  const emptyState = useMemo(
    () => (
      <div className="py-12 text-center space-y-3">
        <Inbox size={48} className="mx-auto text-muted/40" />
        <div>
          <p className="text-sm font-medium text-foreground">
            آگهی‌ای یافت نشد
          </p>
          <p className="text-xs text-muted mt-1">
            با فیلترهای انتخابی هیچ آگهی‌ای پیدا نشد.
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
        selectable={true}
        selected={selected}
        onSelectionChange={setSelected}
        rowActions={LISTING_ROW_ACTIONS[role]}
        bulkActions={isAdmin ? LISTING_BULK_ACTIONS : []}
        onRowAction={handleRowAction}
        onBulkAction={handleBulkAction}
        pagination={pagination}
        onPageChange={setPage}
      />

      <ConfirmModal
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="حذف آگهی"
        message={`آگهی "${pendingDelete?.title || ""}" حذف خواهد شد. آیا مطمئن هستید؟`}
        variant="danger"
      />

      {detailListing && (
        <ListingDetailModal
          isOpen={!!detailListing}
          onClose={() => setDetailListing(null)}
          listing={detailListing}
          onRegisterCall={(listing) => setCallListing(listing)}
        />
      )}

      {callListing && (
        <RegisterCallForm
          isOpen={!!callListing}
          onClose={() => setCallListing(null)}
          listingId={callListing.id}
          onSubmit={(data) => {
            console.log("register call", data);
            setCallListing(null);
          }}
        />
      )}

      {assignListingId && (
        <AssignOperatorModal
          isOpen={!!assignListingId}
          onClose={() => setAssignListingId(null)}
          listingId={assignListingId}
          onAssign={(userId) => {
            console.log("assign", assignListingId, "to", userId);
            setAssignListingId(null);
          }}
        />
      )}
    </>
  );
}
