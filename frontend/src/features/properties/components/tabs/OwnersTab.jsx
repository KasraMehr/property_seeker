import { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, Inbox } from "lucide-react";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useOwner from "@/features/owners/hooks/useOwner";
import useAuth from "@/features/auth/hooks/useAuth";
import useUsersMap from "@/features/users-management/hooks/useUsersMap";
import {
  OWNER_TABLE_COLUMNS,
  OWNER_ROW_ACTIONS,
  OWNER_BULK_ACTIONS,
  OWNER_ALL_FILTERS,
} from "@/features/owners/config";
import OwnerDetailModal from "@/features/owners/components/OwnerDetailModal";
import OwnerFormModal from "@/features/owners/components/OwnerFormModal";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import Button from "@/shared/ui/Button";
import useDebounce from "@/shared/useDebounce";
import { toastService } from "@/lib/toast";

export default function OwnersTab({ onHeaderStateChange }) {
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
    remove,
    refresh,
  } = useOwner();

  const usersMap = useUsersMap();
  const { user } = useAuth();
  const isOwner = Boolean(user?.is_owner);

  const [selected, setSelected] = useState([]);
  const [detailOwner, setDetailOwner] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [formOwner, setFormOwner] = useState(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState(null);

  /* ─── Resolve created_by IDs to names ─── */
  const resolvedData = useMemo(() => {
    if (!data?.length || !Object.keys(usersMap).length) return data;
    return data.map((row) => ({
      ...row,
      created_by: usersMap[row.created_by] || row.created_by,
    }));
  }, [data, usersMap]);

  /* ─── Header Actions ─── */
  useEffect(() => {
    onHeaderStateChange?.({
      loading,
      onRefresh: refresh,
      actions: (
        <Button
          variant="primary"
          size="sm"
          className="gap-1.5"
          onClick={() => setFormOwner({})}
        >
          <Plus size={16} />
          مالک جدید
        </Button>
      ),
    });
    return () => onHeaderStateChange?.(null);
  }, [loading, refresh, onHeaderStateChange]);

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

  /* ─── Open Detail ─── */
  const openDetail = useCallback(
    async (row) => {
      setDetailOwner(row);
      setDetailLoading(true);
      try {
        if (getById) {
          const full = await getById(row.id);
          setDetailOwner(full?.data ?? full);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setDetailLoading(false);
      }
    },
    [getById],
  );

  /* ─── Row Actions ─── */
  const handleRowAction = useCallback(
    (actionKey, row) => {
      switch (actionKey) {
        case "view":
          openDetail(row);
          break;
        case "edit":
          setFormOwner(row);
          break;
        case "delete":
          setPendingDeleteIds([row.id]);
          break;
        default:
          break;
      }
    },
    [openDetail],
  );

  /* ─── Bulk Action ─── */
  const handleBulkAction = useCallback(
    (actionKey) => {
      if (actionKey === "delete" && selected.length > 0) {
        setPendingDeleteIds([...selected]);
      }
    },
    [selected],
  );

  /* ─── Confirm Delete ─── */
  const confirmDelete = useCallback(async () => {
    if (!pendingDeleteIds?.length) return;
    try {
      await remove(pendingDeleteIds);
      toastService.success(
        pendingDeleteIds.length > 1
          ? `${pendingDeleteIds.length} مالک حذف شدند.`
          : "مالک با موفقیت حذف شد."
      );
      setPendingDeleteIds(null);
      setSelected([]);
      refresh?.();
    } catch (error) {
      toastService.error(error?.response?.data?.detail || "خطا در حذف مالک.");
    }
  }, [pendingDeleteIds, remove, refresh]);

  /* ─── Filters ─── */
  const filters = useMemo(
    () => ({
      schema: (OWNER_ALL_FILTERS || []).filter((f) => {
        if (f.type === "search") return false;
        // ثبت‌کننده only for admin/owner
        if (f.key === "created_by" && !isOwner) return false;
        return true;
      }),
      options: {},
      values: filterValues,
      onChange: setFilter,
      onClear: clearFilter,
      onClearAll: clearAll,
      activeChips,
    }),
    [filterValues, setFilter, clearFilter, clearAll, activeChips, isOwner],
  );

  /* ─── Search Config ─── */
  const searchConfig = useMemo(
    () => ({
      value: searchInput,
      onChange: setSearchInput,
      placeholder: "نام، شماره تماس، کد ملی...",
    }),
    [searchInput],
  );

  /* ─── Pagination ─── */
  const pagination = useMemo(
    () => ({
      page,
      totalPages:
        typeof totalPages === "function" ? totalPages(meta?.count) : totalPages,
    }),
    [page, meta?.count, totalPages],
  );

  /* ─── Empty State ─── */
  const emptyState = useMemo(
    () => (
      <div className="py-12 text-center space-y-3">
        <Inbox size={48} className="mx-auto text-muted/40" />
        <p className="text-sm font-medium">مالکی یافت نشد</p>
        <Button variant="outline" size="sm" onClick={clearAll}>
          حذف فیلترها
        </Button>
      </div>
    ),
    [clearAll],
  );

  /* ─── Table Columns (conditional based on isOwner) ─── */
  const tableColumns = useMemo(() => {
    if (isOwner) return OWNER_TABLE_COLUMNS;
    return OWNER_TABLE_COLUMNS.filter((col) => col.key !== "created_by");
  }, [isOwner]);

  return (
    <>
      <div className="flex h-full flex-col min-h-0">
        <ResourceTemplate
          search={searchConfig}
          filters={filters}
          count={meta?.count || 0}
          countLabel="مالک"
          columns={tableColumns}
          data={resolvedData}
          loading={loading}
          emptyState={emptyState}
          sort={sort}
          onSort={handleSort}
          selectable
          selected={selected}
          onSelectionChange={setSelected}
          rowActions={OWNER_ROW_ACTIONS}
          bulkActions={OWNER_BULK_ACTIONS}
          onRowAction={handleRowAction}
          onBulkAction={handleBulkAction}
          pagination={pagination}
          onPageChange={setPage}
        />
      </div>

      <OwnerDetailModal
        isOpen={!!detailOwner}
        onClose={() => setDetailOwner(null)}
        owner={detailOwner}
        loading={detailLoading}
        usersMap={usersMap}
        onEdit={(o) => {
          setDetailOwner(null);
          setFormOwner(o);
        }}
      />

      {formOwner !== null && (
        <OwnerFormModal
          isOpen
          onClose={() => setFormOwner(null)}
          owner={formOwner?.id ? formOwner : null}
          onSuccess={() => {
            setFormOwner(null);
            refresh?.();
          }}
        />
      )}

      <ConfirmModal
        isOpen={!!pendingDeleteIds?.length}
        onClose={() => setPendingDeleteIds(null)}
        onConfirm={confirmDelete}
        title="حذف مالک"
        message={
          pendingDeleteIds?.length > 1
            ? `${pendingDeleteIds.length} مالک حذف می‌شود. ادامه می‌دهید؟`
            : "این مالک حذف می‌شود. ادامه می‌دهید؟"
        }
        variant="danger"
      />
    </>
  );
}
