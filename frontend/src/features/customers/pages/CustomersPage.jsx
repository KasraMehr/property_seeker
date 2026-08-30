import { useMemo, useState, useCallback, useEffect } from "react";
import { Plus, Users } from "lucide-react";
import { useOutletContext } from "react-router-dom";

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
import CustomerPreferenceFormModal from "../components/CustomerPreferenceFormModal";
import CallFormModal from "@/features/calls/components/CallFormModal";
import useAuth from "@/features/auth/hooks/useAuth";
import { toastService } from "@/lib/toast";

export default function CustomersPage() {
  const { setPageHeader } = useOutletContext();
  const { user: currentUser } = useAuth();
  const isOwner = currentUser?.is_owner;

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
  const [registerCallCustomer, setRegisterCallCustomer] = useState(null);
  const [addPreferenceCustomerId, setAddPreferenceCustomerId] = useState(null);

  /* ─── Page Header ─── */
  useEffect(() => {
    setPageHeader({
      title: "مدیریت مشتریان",
      subtitle: "وضعیت و اطلاعات مشتری ها ",
      breadcrumb: [],
      actions: (
        <Button
          variant="primary"
          size="sm"
          className="gap-1.5"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={16} />
          مشتری جدید
        </Button>
      ),
    });

    return () => {
      setPageHeader(null);
    };
  }, [setPageHeader]);

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
    [sort, setOrdering],
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

        case "register_call": {
          setRegisterCallCustomer(row);
          break;
        }

        case "add_preference": {
          setAddPreferenceCustomerId(row.id);
          break;
        }

        default:
          break;
      }
    },
    [getById],
  );

  /* ─── Confirm Action ─── */
  const confirmAction = useCallback(async () => {
    if (!pendingAction) return;

    const { key, row } = pendingAction;

    if (key === "delete") {
      await remove(row.id);
      setSelected((prev) => prev.filter((id) => id !== row.id));
      toastService.success("مشتری با موفقیت حذف شد.");
    }

    setPendingAction(null);
  }, [pendingAction, remove]);

  /* ─── Bulk Action ─── */
  const handleBulkAction = useCallback(
    async (actionKey) => {
      if (actionKey === "delete" && selected.length > 0) {
        await Promise.all(selected.map((id) => remove(id)));
        setSelected([]);
        refresh();
        toastService.success(`${selected.length} مشتری با موفقیت حذف شدند.`);
      }
    },
    [selected, remove, refresh],
  );

  /* ─── Table Columns (conditional based on isOwner) ─── */
  const tableColumns = useMemo(() => {
    if (isOwner) return CUSTOMER_TABLE_COLUMNS;
    // Operators don't need assigned_agent column (it's always themselves)
    return CUSTOMER_TABLE_COLUMNS.filter((col) => col.key !== "assigned_agent_name");
  }, [isOwner]);

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
    [filterValues, setFilter, clearFilter, clearAll, activeChips],
  );

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
      placeholder: "نام، شماره تماس، کد ملی...",
    }),
    [searchInput],
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
    [clearAll],
  );

  return (
    <>
      <ResourceTemplate
        search={searchConfig}
        filters={filters}
        count={meta?.count || 0}
        countLabel="مشتری"
        columns={tableColumns}
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

      {/* Register Call Modal */}
      <CallFormModal
        isOpen={!!registerCallCustomer}
        onClose={() => setRegisterCallCustomer(null)}
        extraData={{ customer: registerCallCustomer?.id }}
        onSuccess={refresh}
      />

      {/* Add Preference Modal */}
      <CustomerPreferenceFormModal
        isOpen={!!addPreferenceCustomerId}
        onClose={() => setAddPreferenceCustomerId(null)}
        customerId={addPreferenceCustomerId}
        onSuccess={refresh}
      />
    </>
  );
}
