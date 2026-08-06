import { useMemo, useState, useCallback, useEffect } from "react";
import { Plus, Eye, Trash2, Inbox, Phone } from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useCall from "@/features/calls/hooks/useCall";
import {
  CALL_FILTERS,
  CALL_RESULT_CONFIG,
  CALL_TYPE_CONFIG,
  CALL_TABLE_COLUMNS,
} from "@/features/calls/config";
import useDebounce from "@/shared/useDebounce";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import Button from "@/shared/ui/Button";
import CallDetailModal from "@/features/calls/components/CallDetailModal";

const CALL_ROW_ACTIONS = {
  admin: [
    { key: "view", label: "مشاهده", icon: Eye },
    { key: "delete", label: "حذف", icon: Trash2, variant: "danger" },
  ],
  operator: [
    { key: "view", label: "مشاهده", icon: Eye },
  ],
};

const CALL_BULK_ACTIONS = [
  { key: "bulkDelete", label: "حذف گروهی", icon: Trash2, variant: "danger" },
];

export default function CallsPage() {
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
  } = useCall();

  const [selected, setSelected] = useState([]);
  const [detailCall, setDetailCall] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  /* ─── Search ─── */
  const [searchInput, setSearchInput] = useState(filterValues.search || "");
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (filterValues.search !== searchInput) setSearchInput(filterValues.search || "");
  }, [filterValues.search]);

  useEffect(() => {
    if (debouncedSearch !== filterValues.search) setFilter("search", debouncedSearch);
  }, [debouncedSearch, filterValues.search, setFilter]);

  /* ─── Sort ─── */
  const handleSort = useCallback(
    (key) => {
      const dir = sort?.key === key && sort?.dir === "asc" ? "desc" : "asc";
      setOrdering(`${dir === "desc" ? "-" : ""}${key}`);
    },
    [sort, setOrdering],
  );

  /* ─── Row actions ─── */
  const handleRowAction = useCallback((actionKey, row) => {
    switch (actionKey) {
      case "view":
        setDetailCall(row);
        break;
      case "delete":
        setPendingDelete(row);
        break;
      default:
        break;
    }
  }, []);

  /* ─── Bulk ─── */
  const handleBulkAction = useCallback(
    (actionKey) => {
      if (actionKey === "bulkDelete") console.log("bulk delete", selected);
    },
    [selected],
  );

  /* ─── Delete ─── */
  const confirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    await remove(pendingDelete.id);
    setPendingDelete(null);
    setSelected((prev) => prev.filter((id) => id !== pendingDelete.id));
  }, [pendingDelete, remove]);

  /* ─── Filter options ─── */
  const filterOptions = useMemo(() => {
    const typeFilter = CALL_FILTERS.find((f) => f.key === "call_type");
    const resultFilter = CALL_FILTERS.find((f) => f.key === "result");
    const userFilter = CALL_FILTERS.find((f) => f.key === "handled_by");
    const followFilter = CALL_FILTERS.find((f) => f.key === "follow_up_done");
    return {
      callTypes: typeFilter?.options || [],
      results: resultFilter?.options || [],
      users: userFilter?.options || [],
      followUpStatuses: followFilter?.options || [],
    };
  }, []);

  const filters = useMemo(
    () => ({
      schema: CALL_FILTERS.filter((f) => f.type !== "search"),
      options: filterOptions,
      values: filterValues,
      onChange: setFilter,
      onClear: clearFilter,
      onClearAll: clearAll,
      activeChips,
    }),
    [filterOptions, filterValues, setFilter, clearFilter, clearAll, activeChips],
  );

  const pagination = useMemo(
    () => ({ page, totalPages: totalPages(meta?.count) }),
    [page, meta?.count, totalPages],
  );

  const searchConfig = useMemo(
    () => ({
      value: searchInput,
      onChange: setSearchInput,
      label: "جستجو",
      placeholder: "یادداشت، نام مشتری، کد ملک...",
    }),
    [searchInput],
  );

  /* ─── Header ─── */
  const customHeader = useMemo(
    () => (
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            مدیریت تماس‌ها
          </h1>
          <p className="text-sm text-muted mt-1">
            {(meta?.count || 0).toLocaleString("fa-IR")} تماس
            {selected.length > 0 && (
              <span className="mr-2 text-(--role-primary)">
                ({selected.length.toLocaleString("fa-IR")} انتخاب شده)
              </span>
            )}
          </p>
        </div>
        <Button variant="primary" size="sm" className="gap-1.5">
          <Plus size={16} />
          تماس جدید
        </Button>
      </div>
    ),
    [meta?.count, selected.length],
  );

  /* ─── Empty ─── */
  const emptyState = useMemo(
    () => (
      <div className="py-12 text-center space-y-3">
        <Phone size={48} className="mx-auto text-muted/40" />
        <div>
          <p className="text-sm font-medium text-foreground">تماسی یافت نشد</p>
          <p className="text-xs text-muted mt-1">با فیلترهای انتخابی هیچ تماسی پیدا نشد.</p>
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
        columns={CALL_TABLE_COLUMNS}
        data={data}
        loading={loading}
        emptyState={emptyState}
        sort={sort}
        onSort={handleSort}
        selectable={true}
        selected={selected}
        onSelectionChange={setSelected}
        rowActions={CALL_ROW_ACTIONS[role]}
        bulkActions={isAdmin ? CALL_BULK_ACTIONS : []}
        onRowAction={handleRowAction}
        onBulkAction={handleBulkAction}
        pagination={pagination}
        onPageChange={setPage}
      />

      <ConfirmModal
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="حذف تماس"
        message={`تماس #${pendingDelete?.id || ""} حذف خواهد شد. آیا مطمئن هستید؟`}
        variant="danger"
      />

      {detailCall && (
        <CallDetailModal
          isOpen={!!detailCall}
          onClose={() => setDetailCall(null)}
          call={detailCall}
        />
      )}
    </>
  );
}