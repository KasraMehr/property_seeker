import { useMemo, useState, useCallback, useEffect } from "react";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  ExternalLink,
  Inbox,
  Home,
} from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import PropertyDetailModal from "@/features/properties/components/PropertyDetailModal";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useProperty from "@/features/properties/hooks/useProperty";
import {
  PROPERTY_ALL_FILTERS,
  PROPERTY_STATUS_CONFIG,
  PROPERTY_TABLE_COLUMNS,
} from "@/features/properties/config";
import { buildStatusConfig } from "@/constants/status.utils";
import useDebounce from "@/shared/useDebounce";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import Button from "@/shared/ui/Button";

const PROPERTY_ROW_ACTIONS = {
  admin: [
    { key: "view", label: "مشاهده", icon: Eye },
    { key: "edit", label: "ویرایش", icon: Pencil },
    { key: "delete", label: "حذف", icon: Trash2, variant: "danger" },
  ],
  operator: [
    { key: "view", label: "مشاهده", icon: Eye },
    { key: "edit", label: "ویرایش", icon: Pencil },
  ],
};

const PROPERTY_BULK_ACTIONS = [
  { key: "bulkDelete", label: "حذف گروهی", icon: Trash2, variant: "danger" },
];

export default function PropertiesPage() {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.is_owner);
  const role = isAdmin ? "admin" : "operator";
  const [detailProperty, setDetailProperty] = useState(null);

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
  } = useProperty();

  const [selected, setSelected] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);

  // ─── Debounced search state ───
  const [searchInput, setSearchInput] = useState(filterValues.search || "");
  const debouncedSearch = useDebounce(searchInput, 400);

  // Sync external clear → input
  useEffect(() => {
    if (filterValues.search !== searchInput) {
      setSearchInput(filterValues.search || "");
    }
  }, [filterValues.search]);

  // Debounced search → API
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
        setDetailProperty(row);
        break;
      case "edit":
        console.log("edit property", row.id);
        break;
      case "delete":
        setPendingDelete(row);
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
    const statusFilter = PROPERTY_ALL_FILTERS.find((f) => f.key === "status");
    const typeFilter = PROPERTY_ALL_FILTERS.find((f) => f.key === "property_type");
    const dealFilter = PROPERTY_ALL_FILTERS.find((f) => f.key === "deal_type");
    const userFilter = PROPERTY_ALL_FILTERS.find((f) => f.key === "created_by");
    return {
      statuses: statusFilter?.options || [],
      propertyTypes: typeFilter?.options || [],
      dealTypes: dealFilter?.options || [],
      users: userFilter?.options || [],
    };
  }, []);

  // FilterBar schema excludes search (handled by SearchBox)
  const filters = useMemo(
    () => ({
      schema: PROPERTY_ALL_FILTERS.filter((f) => f.type !== "search"),
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

  // ─── Search config ───
  const searchConfig = useMemo(
    () => ({
      value: searchInput,
      onChange: setSearchInput,
      label: "جستجو",
      placeholder: "عنوان، کد ملک، توضیحات...",
    }),
    [searchInput],
  );

  // ─── Custom header ───
  const customHeader = useMemo(
    () => (
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            مدیریت املاک
          </h1>
          <p className="text-sm text-muted mt-1">
            {(meta?.count || 0).toLocaleString("fa-IR")} ملک
            {selected.length > 0 && (
              <span className="mr-2 text-(--role-primary)">
                ({selected.length.toLocaleString("fa-IR")} انتخاب شده)
              </span>
            )}
          </p>
        </div>
        <Button variant="primary" size="sm" className="gap-1.5">
          <Plus size={16} />
          ملک جدید
        </Button>
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
          <p className="text-sm font-medium text-foreground">ملکی یافت نشد</p>
          <p className="text-xs text-muted mt-1">
            با فیلترهای انتخابی هیچ ملکی پیدا نشد.
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
        columns={PROPERTY_TABLE_COLUMNS}
        data={data}
        loading={loading}
        emptyState={emptyState}
        sort={sort}
        onSort={handleSort}
        selectable={true}
        selected={selected}
        onSelectionChange={setSelected}
        rowActions={PROPERTY_ROW_ACTIONS[role]}
        bulkActions={isAdmin ? PROPERTY_BULK_ACTIONS : []}
        onRowAction={handleRowAction}
        onBulkAction={handleBulkAction}
        pagination={pagination}
        onPageChange={setPage}
      />

      <ConfirmModal
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="حذف ملک"
        message={`ملک "${pendingDelete?.title || ""}" حذف خواهد شد. آیا مطمئن هستید؟`}
        variant="danger"
      />

      {detailProperty && (
        <PropertyDetailModal
          isOpen={!!detailProperty}
          onClose={() => setDetailProperty(null)}
          property={detailProperty}
          calls={[]} // TODO: fetch from API
          followups={[]} // TODO: fetch from API
          sourceListing={null} // TODO: pass if available
          onViewSourceListing={(listing) => {
            console.log("view source listing", listing);
          }}
          onRegisterFollowup={(property) => {
            console.log("register followup for", property.id);
          }}
        />
      )}
    </>
  );
}
