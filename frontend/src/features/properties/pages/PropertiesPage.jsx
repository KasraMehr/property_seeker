import { useMemo, useState, useCallback, useEffect } from "react";
import { Plus, Inbox } from "lucide-react";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useProperty from "@/features/properties/hooks/useProperty";
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
import RegisterCallForm from "../../../shared/forms/RegisterCallForm";

export default function PropertiesPage() {
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
  const [formProperty, setFormProperty] = useState(null); // null=closed, {}=create, obj=edit
  const [callProperty, setCallProperty] = useState(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState(null);

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

  const handleSort = useCallback(
    (key) => {
      const dir = sort?.key === key && sort?.dir === "asc" ? "desc" : "asc";
      setOrdering(`${dir === "desc" ? "-" : ""}${key}`);
    },
    [sort, setOrdering],
  );

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

  const handleRowAction = useCallback(
    (actionKey, row) => {
      switch (actionKey) {
        case "view":
          openDetail(row);
          break;
        case "edit":
          setFormProperty(row);
          break;
        case "register_call":
          setCallProperty(row);
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

  const handleBulkAction = useCallback(
    (actionKey) => {
      if (actionKey === "delete" && selected.length > 0) {
        setPendingDeleteIds([...selected]);
      }
    },
    [selected],
  );

  const confirmDelete = useCallback(async () => {
    if (!pendingDeleteIds?.length) return;
    await remove(pendingDeleteIds);
    setPendingDeleteIds(null);
    setSelected([]);
    refresh?.();
  }, [pendingDeleteIds, remove, refresh]);

  const filters = useMemo(
    () => ({
      schema: (PROPERTY_ALL_FILTERS || []).filter((f) => f.type !== "search"),
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
      placeholder: "عنوان، کد ملک...",
    }),
    [searchInput],
  );

  const pagination = useMemo(
    () => ({
      page,
      totalPages:
        typeof totalPages === "function" ? totalPages(meta?.count) : totalPages,
    }),
    [page, meta?.count, totalPages],
  );

  const customHeader = useMemo(
    () => (
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            فایل‌های ملکی
          </h1>
          <p className="text-sm text-muted mt-1">
            {(meta?.count || 0).toLocaleString("fa-IR")} ملک
            {selected.length > 0 && (
              <span className="mr-2 text-primary">
                ({selected.length.toLocaleString("fa-IR")} انتخاب‌شده)
              </span>
            )}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="gap-1.5"
          onClick={() => setFormProperty({})}
        >
          <Plus size={16} />
          ملک جدید
        </Button>
      </div>
    ),
    [meta?.count, selected.length],
  );

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

  return (
    <>
      <ResourceTemplate
        header={customHeader}
        search={searchConfig}
        filters={filters}
        columns={PROPERTY_TABLE_COLUMNS}
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

      <PropertyDetailModal
        isOpen={!!detailProperty}
        onClose={() => setDetailProperty(null)}
        property={detailProperty}
        loading={detailLoading}
        onRegisterCall={(p) => {
          setCallProperty(p);
        }}
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

      <RegisterCallForm
        isOpen={!!callProperty}
        onClose={() => setCallProperty(null)}
        property={callProperty}
        onSuccess={() => setCallProperty(null)}
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
