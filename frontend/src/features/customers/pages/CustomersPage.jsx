import { useMemo, useState, useCallback, useEffect } from "react";
import { Plus, Users, Eye, Pencil, Trash2, Phone } from "lucide-react";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useCustomer from "../hooks/useCustomer";
import {
  CUSTOMER_ALL_FILTERS,
  CUSTOMER_TABLE_COLUMNS,
  CUSTOMER_ROW_ACTIONS,
  CUSTOMER_BULK_ACTIONS,
  CUSTOMER_ALL_ACTIONS,
} from "../config";
import useDebounce from "@/shared/useDebounce";
import Button from "@/shared/ui/Button";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import CustomerFormModal from "../components/CustomerFormModal";
import CustomerDetailModal from "../components/CustomerDetailModal";

export default function CustomersPage() {
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
    getById,
    refresh,
  } = useCustomer();

  const [selected, setSelected] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [detailCustomer, setDetailCustomer] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  /* ─── Search ─── */
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

  /* ─── Sort ─── */
  const handleSort = useCallback(
    (key) => {
      const dir = sort?.key === key && sort?.dir === "asc" ? "desc" : "asc";
      setOrdering(`${dir === "desc" ? "-" : ""}${key}`);
    },
    [sort, setOrdering]
  );

  /* ─── Row Actions ─── */
  const handleRowAction = useCallback(
    async (actionKey, row) => {
      const action = CUSTOMER_ALL_ACTIONS.find((a) => a.key === actionKey);

      if (action?.confirm) {
        setPendingAction({ key: actionKey, row, confirm: action.confirm });
        return;
      }

      switch (actionKey) {
        case "view": {
          const full = await getById(row.id);
          setDetailCustomer(full);
          break;
        }
        case "edit": {
          const full = await getById(row.id);
          setEditCustomer(full);
          break;
        }
        default:
          break;
      }
    },
    [getById]
  );

  /* ─── Confirm Action ─── */
  const confirmAction = useCallback(async () => {
    if (!pendingAction) return;

    const { key, row } = pendingAction;

    if (key === "delete") {
      await remove(row.id);
      setSelected((prev) => prev.filter((id) => id !== row.id));
    }

    setPendingAction(null);
  }, [pendingAction, remove]);

  /* ─── Bulk Action ─── */
  const handleBulkAction = useCallback(
    async (actionKey) => {
      if (actionKey === "delete" && selected.length > 0) {
        // اگر bulk endpoint داری اینجا صدا بزن
        // فعلاً تک‌تک حذف می‌کنیم
        await Promise.all(selected.map((id) => remove(id)));
        setSelected([]);
        refresh();
      }
    },
    [selected, remove, refresh]
  );

  /* ─── Filters ─── */
  const filters = useMemo(
    () => ({
      schema: CUSTOMER_ALL_FILTERS.filter((f) => f.type !== "search"),
      values: filterValues,
      onChange: setFilter,
      onClear: clearFilter,
      onClearAll: clearAll,
      activeChips,
    }),
    [filterValues, setFilter, clearFilter, clearAll, activeChips]
  );

  const pagination = useMemo(
    () => ({
      page,
      totalPages: totalPages(meta?.count),
    }),
    [page, meta?.count, totalPages]
  );

  const searchConfig = useMemo(
    () => ({
      value: searchInput,
      onChange: setSearchInput,
      label: "جستجو",
      placeholder: "نام، شماره تماس، کد ملی...",
    }),
    [searchInput]
  );

  /* ─── Header ─── */
  const customHeader = useMemo(
    () => (
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            مدیریت مشتریان
          </h1>
          <p className="text-sm text-muted mt-1">
            {(meta?.count || 0).toLocaleString("fa-IR")} مشتری
            {selected.length > 0 && (
              <span className="mr-2 text-(--role-primary)">
                ({selected.length.toLocaleString("fa-IR")} انتخاب شده)
              </span>
            )}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="gap-1.5"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={16} />
          مشتری جدید
        </Button>
      </div>
    ),
    [meta?.count, selected.length]
  );

  /* ─── Empty State ─── */
  const emptyState = useMemo(
    () => (
      <div className="py-12 text-center space-y-3">
        <Users size={48} className="mx-auto text-muted/40" />
        <div>
          <p className="text-sm font-medium text-foreground">
            مشتری‌ای یافت نشد
          </p>
          <p className="text-xs text-muted mt-1">
            با فیلترهای انتخابی هیچ مشتری‌ای پیدا نشد.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={clearAll}>
          حذف فیلترها
        </Button>
      </div>
    ),
    [clearAll]
  );

  return (
    <>
      <ResourceTemplate
        header={customHeader}
        search={searchConfig}
        filters={filters}
        columns={CUSTOMER_TABLE_COLUMNS}
        data={data}
        loading={loading}
        emptyState={emptyState}
        sort={sort}
        onSort={handleSort}
        selectable={true}
        selected={selected}
        onSelectionChange={setSelected}
        rowActions={CUSTOMER_ROW_ACTIONS}
        bulkActions={CUSTOMER_BULK_ACTIONS}
        onRowAction={handleRowAction}
        onBulkAction={handleBulkAction}
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={pendingAction !== null}
        onClose={() => setPendingAction(null)}
        onConfirm={confirmAction}
        title={pendingAction?.confirm?.title || "تأیید"}
        message={pendingAction?.confirm?.message || "آیا مطمئن هستید؟"}
        variant="danger"
      />

      {/* Detail Modal */}
      <CustomerDetailModal
        isOpen={!!detailCustomer}
        onClose={() => setDetailCustomer(null)}
        customer={detailCustomer}
      />

      {/* Create Modal */}
      <CustomerFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={refresh}
      />

      {/* Edit Modal */}
      <CustomerFormModal
        isOpen={!!editCustomer}
        onClose={() => setEditCustomer(null)}
        customer={editCustomer}
        onSuccess={refresh}
      />
    </>
  );
}