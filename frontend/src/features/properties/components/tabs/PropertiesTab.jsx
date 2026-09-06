import { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, Inbox } from "lucide-react";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useProperty from "@/features/properties/hooks/useProperty";
import useAuth from "@/features/auth/hooks/useAuth";
import {
  PROPERTY_ALL_FILTERS,
  PROPERTY_TABLE_COLUMNS,
  PROPERTY_ROW_ACTIONS,
  PROPERTY_BULK_ACTIONS,
} from "@/features/properties/config";
import useDebounce from "@/shared/useDebounce";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import Button from "@/shared/ui/Button";
import PropertyDetailModal from "@/features/properties/components/PropertyDetailModal";
import PropertyFormModal from "@/features/properties/components/PropertyFormModal";
import ChangePropertyStatusModal from "@/features/properties/components/ChangePropertyStatusModal";
import CallFormModal from "@/features/calls/components/CallFormModal";
import { toastService } from "@/lib/toast";

export default function PropertiesTab({ onHeaderStateChange }) {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.is_owner);

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
  } = useProperty();

  const [selected, setSelected] = useState([]);
  const [detailProperty, setDetailProperty] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [formProperty, setFormProperty] = useState(null);
  const [callProperty, setCallProperty] = useState(null);
  const [statusProperty, setStatusProperty] = useState(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState(null);

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
          onClick={() => setFormProperty({})}
        >
          <Plus size={16} />
          ملک جدید
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setDetailProperty(row);
      setDetailLoading(true);
      try {
        if (getById) {
          const full = await getById(row.id);
          setDetailProperty(full?.data ?? full);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setDetailLoading(false);
      }
    },
    [getById],
  );

  /* ─── Open Edit (full record so description/location auto-fill) ─── */
  const openEdit = useCallback(
    async (row) => {
      setFormProperty(row);
      try {
        if (getById) {
          const full = await getById(row.id);
          setFormProperty(full?.data ?? full);
        }
      } catch (e) {
        console.error(e);
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
          openEdit(row);
          break;
        case "register_call":
          setCallProperty(row);
          break;
        case "change_status":
          setStatusProperty(row);
          break;
        case "delete":
          setPendingDeleteIds([row.id]);
          break;
        default:
          break;
      }
    },
    [openDetail, openEdit],
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
          ? `${pendingDeleteIds.length} ملک حذف شدند.`
          : "ملک با موفقیت حذف شد.",
      );
      setPendingDeleteIds(null);
      setSelected([]);
      refresh?.();
    } catch (error) {
      toastService.error(error?.response?.data?.detail || "خطا در حذف ملک.");
    }
  }, [pendingDeleteIds, remove, refresh]);

  /* ─── Filters ─── */
  const filters = useMemo(
    () => ({
      schema: (PROPERTY_ALL_FILTERS || []).filter((f) => {
        if (f.type === "search") return false;
        // Agent filter only for admin/owner
        if (f.key === "agent" && !isAdmin) return false;
        return true;
      }),
      options: {},
      values: filterValues,
      onChange: setFilter,
      onClear: clearFilter,
      onClearAll: clearAll,
      activeChips,
    }),
    [filterValues, setFilter, clearFilter, clearAll, activeChips],
  );

  /* ─── Search Config ─── */
  const searchConfig = useMemo(
    () => ({
      value: searchInput,
      onChange: setSearchInput,
      placeholder: "عنوان، کد ملک...",
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
        <p className="text-sm font-medium">ملکی یافت نشد</p>
        <Button variant="outline" size="sm" onClick={clearAll}>
          حذف فیلترها
        </Button>
      </div>
    ),
    [clearAll],
  );

  /* ─── Table Columns (conditional based on isAdmin) ─── */
  const tableColumns = useMemo(() => {
    if (isAdmin) return PROPERTY_TABLE_COLUMNS;
    return PROPERTY_TABLE_COLUMNS.filter((col) => col.key !== "agent");
  }, [isAdmin]);

  return (
    <>
      <div className="flex h-full flex-col min-h-0">
        <ResourceTemplate
          search={searchConfig}
          filters={filters}
          count={meta?.count || 0}
          countLabel="ملک"
          columns={tableColumns}
          data={data}
          loading={loading}
          emptyState={emptyState}
          sort={sort}
          onSort={handleSort}
          selectable
          selected={selected}
          onSelectionChange={setSelected}
          rowActions={PROPERTY_ROW_ACTIONS}
          bulkActions={PROPERTY_BULK_ACTIONS}
          onRowAction={handleRowAction}
          onBulkAction={handleBulkAction}
          pagination={pagination}
          onPageChange={setPage}
        />
      </div>

      <PropertyDetailModal
        isOpen={!!detailProperty}
        onClose={() => setDetailProperty(null)}
        property={detailProperty}
        loading={detailLoading}
        onRegisterCall={(p) => setCallProperty(p)}
        onEdit={(p) => {
          setDetailProperty(null);
          setFormProperty(p);
        }}
      />

      {formProperty !== null && (
        <PropertyFormModal
          isOpen
          onClose={() => setFormProperty(null)}
          property={formProperty?.id ? formProperty : null}
          onSuccess={() => {
            setFormProperty(null);
            refresh?.();
          }}
        />
      )}

      <CallFormModal
        isOpen={!!callProperty}
        onClose={() => setCallProperty(null)}
        extraData={{ property: callProperty }}
        onSuccess={() => setCallProperty(null)}
      />

      <ChangePropertyStatusModal
        isOpen={!!statusProperty}
        onClose={() => setStatusProperty(null)}
        properties={statusProperty ? [statusProperty] : []}
        onSuccess={() => {
          setStatusProperty(null);
          refresh?.();
        }}
      />

      <ConfirmModal
        isOpen={!!pendingDeleteIds?.length}
        onClose={() => setPendingDeleteIds(null)}
        onConfirm={confirmDelete}
        title="حذف ملک"
        message={
          pendingDeleteIds?.length > 1
            ? `${pendingDeleteIds.length} ملک حذف می‌شود. ادامه می‌دهید؟`
            : "این فایل ملکی حذف می‌شود. ادامه می‌دهید؟"
        }
        variant="danger"
      />
    </>
  );
}
