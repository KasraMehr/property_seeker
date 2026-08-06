import { useMemo, useState, useCallback, useEffect } from "react";
import { Plus, Eye, Pencil, Trash2, Inbox, Users } from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import PageTabs from "@/shared/page/PageTabs";
import { getRoleConfig } from "@/constants/roleConfig";
import useUser from "@/features/users-management/hooks/useUser";
import {
  USER_FILTERS,
  USER_STATUS_CONFIG,
  USER_TABLE_COLUMNS,
} from "@/features/users-management/config";
import useDebounce from "@/shared/useDebounce";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import Button from "@/shared/ui/Button";
import UserDetailModal from "@/features/users-management/components/UserDetailModal";

const ROLE_TABS = [
  { id: "all", label: "همه کاربران" },
  { id: "management", label: "مدیریت" },
  { id: "staff", label: "کارشناسان" },
];

/* ─── Row Actions ─── */
const USER_ROW_ACTIONS = {
  admin: [
    { key: "view", label: "مشاهده", icon: Eye },
    { key: "edit", label: "ویرایش", icon: Pencil },
    { key: "delete", label: "حذف", icon: Trash2, variant: "danger" },
  ],
  operator: [{ key: "view", label: "مشاهده", icon: Eye }],
};

const USER_BULK_ACTIONS = [
  { key: "bulkDelete", label: "حذف گروهی", icon: Trash2, variant: "danger" },
];

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = Boolean(currentUser?.is_owner);
  const role = isAdmin ? "admin" : "operator";

  const {
    data: rawData,
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
  } = useUser();

  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [detailUser, setDetailUser] = useState(null);

  /* ─── Tab Filtering (client-side) ───
   * management = admin | supervisor | is_owner
   * staff      = operator | agent | viewer
   */
  const displayData = useMemo(() => {
    if (!rawData) return [];
    if (activeTab === "all") return rawData;

    return rawData.filter((u) => {
      const roleKey = getRoleConfig(u.role?.[0])?.key;

      if (activeTab === "management") {
        return ["admin", "supervisor", "owner"].includes(roleKey) || u.is_owner;
      }
      if (activeTab === "staff") {
        return ["operator", "agent", "viewer"].includes(roleKey);
      }
      return true;
    });
  }, [rawData, activeTab]);

  /* ─── Tab Badge Counts ─── */
  const tabItems = useMemo(() => {
    if (!rawData) return ROLE_TABS.map((t) => ({ ...t, badge: 0 }));

    const counts = {
      all: rawData.length,
      management: rawData.filter((u) => {
        const key = getRoleConfig(u.role?.[0])?.key;
        return ["admin", "supervisor", "owner"].includes(key) || u.is_owner;
      }).length,
      staff: rawData.filter((u) => {
        const key = getRoleConfig(u.role?.[0])?.key;
        return ["operator", "agent", "viewer"].includes(key);
      }).length,
    };

    return ROLE_TABS.map((t) => ({
      ...t,
      badge: counts[t.id],
    }));
  }, [rawData]);

  /* ─── Search ─── */
  const [searchInput, setSearchInput] = useState(filterValues.search || "");
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (filterValues.search !== searchInput)
      setSearchInput(filterValues.search || "");
  }, [filterValues.search]);

  useEffect(() => {
    if (debouncedSearch !== filterValues.search)
      setFilter("search", debouncedSearch);
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
        setDetailUser(row);
        break;
      case "edit":
        console.log("edit user", row.id);
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
    const roleFilter = USER_FILTERS.find((f) => f.key === "role");
    const statusFilter = USER_FILTERS.find((f) => f.key === "is_active");
    const agencyFilter = USER_FILTERS.find((f) => f.key === "agency");
    return {
      roles: roleFilter?.options || [],
      statuses: statusFilter?.options || [],
      agencies: agencyFilter?.options || [],
    };
  }, []);

  /* ─── Schema without role_category (handled by tabs) ─── */
  const filters = useMemo(
    () => ({
      schema: USER_FILTERS.filter(
        (f) => f.type !== "search" && f.key !== "role_category",
      ),
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

  const pagination = useMemo(
    () => ({ page, totalPages: totalPages(meta?.count) }),
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

  /* ─── Header with PageTabs ─── */
  const customHeader = useMemo(
    () => (
      <div className="space-y-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              مدیریت کاربران
            </h1>
            <p className="text-sm text-muted mt-1">
              {displayData.length.toLocaleString("fa-IR")} کاربر
              {selected.length > 0 && (
                <span className="mr-2 text-(--role-primary)">
                  ({selected.length.toLocaleString("fa-IR")} انتخاب شده)
                </span>
              )}
            </p>
          </div>
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus size={16} />
            کاربر جدید
          </Button>
        </div>

        <PageTabs items={tabItems} value={activeTab} onChange={setActiveTab} />
      </div>
    ),
    [displayData.length, selected.length, tabItems, activeTab],
  );

  /* ─── Empty ─── */
  const emptyState = useMemo(
    () => (
      <div className="py-12 text-center space-y-3">
        <Users size={48} className="mx-auto text-muted/40" />
        <div>
          <p className="text-sm font-medium text-foreground">کاربری یافت نشد</p>
          <p className="text-xs text-muted mt-1">
            با فیلترهای انتخابی هیچ کاربری پیدا نشد.
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
        columns={USER_TABLE_COLUMNS}
        data={displayData}
        loading={loading}
        emptyState={emptyState}
        sort={sort}
        onSort={handleSort}
        selectable={true}
        selected={selected}
        onSelectionChange={setSelected}
        rowActions={USER_ROW_ACTIONS[role]}
        bulkActions={isAdmin ? USER_BULK_ACTIONS : []}
        onRowAction={handleRowAction}
        onBulkAction={handleBulkAction}
        pagination={pagination}
        onPageChange={setPage}
      />

      <ConfirmModal
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="حذف کاربر"
        message={`کاربر "${pendingDelete?.full_name || ""}" حذف خواهد شد. آیا مطمئن هستید؟`}
        variant="danger"
      />
      {/* ─── Detail Modal ─── */}
      {detailUser && (
        <UserDetailModal
          isOpen={!!detailUser}
          onClose={() => setDetailUser(null)}
          user={detailUser}
          stats={{
            property_count: detailUser._property_count || 0,
            call_count: detailUser._call_count || 0,
            followup_count: detailUser._followup_count || 0,
            listing_count: detailUser._listing_count || 0,
          }}
          activities={detailUser._activities || []}
        />
      )}
    </>
  );
}
