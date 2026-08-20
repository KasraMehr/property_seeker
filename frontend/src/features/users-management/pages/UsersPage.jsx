import { useMemo, useState, useCallback, useEffect } from "react";
import { Plus, Users } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import PageTabs from "@/shared/page/PageTabs";
import { getRoleConfig } from "@/constants/roleConfig";
import useUser from "@/features/users-management/hooks/useUser";
import {
  USER_ALL_FILTERS,
  USER_TABLE_COLUMNS,
  USER_ROW_ACTIONS,
  USER_BULK_ACTIONS,
} from "@/features/users-management/config";
import useDebounce from "@/shared/useDebounce";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import Button from "@/shared/ui/Button";
import UserDetailModal from "@/features/users-management/components/UserDetailModal";
import UserFormModal from "@/features/users-management/components/UserFormModal";
import ChangeUserRoleModal from "@/features/users-management/components/ChangeUserRoleModal";
import ToggleUserActiveModal from "@/features/users-management/components/ToggleUserActiveModal";
import userService from "@/features/users-management/services/userService";
import { toastService } from "@/lib/toast";
import api from "@/lib/api";

const ROLE_TABS = [
  { id: "all", label: "همه کاربران" },
  { id: "management", label: "مدیریت" },
  { id: "staff", label: "کارشناسان" },
];

/**
 * accounts.User is gated on the backend by IsAgencyOwner, not
 * HasRolePermission — there is no fine-grained codename for edit/delete/etc,
 * which is why every mutating action in userActions.js carries
 * `permission: null`. "view" is the one action meant to stay open to
 * everyone (per the comment in userActions.js); every other null-permission
 * action in this set is owner-only and must be gated with isOwner() instead.
 */
function isRowActionVisible(action, { hasPermission, isOwner }) {
  if (action.key === "view") return true;
  if (action.permission) return hasPermission(action.permission);
  return isOwner;
}

function isBulkActionVisible(action, { isOwner }) {
  // Same reasoning as isRowActionVisible — every bulk mutation here is
  // owner-only on the backend.
  return isOwner;
}

export default function UsersPage() {
  const { setPageHeader } = useOutletContext();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const isOwner = useAuthStore((s) => s.isOwner());

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
    refresh,
  } = useUser();

  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  // ─── Modal / dialog state ───
  const [detailUser, setDetailUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [creating, setCreating] = useState(false);
  const [changeRoleTargets, setChangeRoleTargets] = useState(null); // array of users | null
  const [toggleActiveTargets, setToggleActiveTargets] = useState(null); // array of users | null
  const [pendingConfirm, setPendingConfirm] = useState(null); // { action, rows } | null
  const [confirmLoading, setConfirmLoading] = useState(false);

  /* ─── Permission-filtered actions ───
   * userActions.js's `condition(row)` isn't the prop ResourceTable reads —
   * it reads `visible(row)` (shared/templates/resource/components/ResourceTable.jsx).
   * Mapped here rather than changing the config or the shared table.
   */
  const visibleRowActions = useMemo(
    () =>
      USER_ROW_ACTIONS.filter((action) =>
        isRowActionVisible(action, { hasPermission, isOwner }),
      ).map((action) => ({
        ...action,
        variant: action.danger ? "danger" : action.variant,
        visible: action.condition,
      })),
    [hasPermission, isOwner],
  );

  const visibleBulkActions = useMemo(
    () =>
      USER_BULK_ACTIONS.filter((action) =>
        isBulkActionVisible(action, { isOwner }),
      ).map((action) => ({
        ...action,
        variant: action.danger ? "danger" : action.variant,
      })),
    [isOwner],
  );

  const canCreateUser = isOwner;

  /* ─── Tab Filtering (client-side) ───
   * management = admin | supervisor | is_owner
   * staff      = operator | agent | viewer
   */
  const displayData = useMemo(() => {
    if (!rawData) return [];
    if (activeTab === "all") return rawData;

    return rawData.filter((u) => {
      const roleKey = getRoleConfig(u.role?.[0]?.name)?.key;
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

    return ROLE_TABS.map((t) => ({ ...t, badge: counts[t.id] }));
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

  /* ─── Row actions ───
   * Dispatch purely from what's declared on the action in userActions.js:
   *  - `modal: "detail" | "edit"`         → open that modal directly
   *  - has a `confirm` block              → go through the shared ConfirmModal
   *  - otherwise (only toggle_active_enable today) → run immediately
   */
  const handleRowAction = useCallback(
    async (actionKey, row) => {
      const action = USER_ROW_ACTIONS.find((a) => a.key === actionKey);
      if (!action) return;

      if (action.modal === "detail") {
        setDetailUser(row);
        return;
      }
      if (action.modal === "edit") {
        setEditUser(row);
        return;
      }
      if (action.confirm) {
        setPendingConfirm({ action, rows: [row] });
        return;
      }
      if (action.handler === "toggle_active") {
        // No confirm block on this variant (toggle_active_enable) — turning
        // a user back on doesn't need a confirmation step.
        await userService.patch(row.id, { is_active: true });
        toastService.success("کاربر فعال شد");
        refresh();
      }
    },
    [refresh],
  );

  /* ─── Bulk actions ───
   * "toggle_active" deliberately opens ToggleUserActiveModal instead of
   * blind-toggling — a bulk selection can mix active/inactive users, and
   * that modal already asks explicitly which status to set.
   */
  const handleBulkAction = useCallback(
    (actionKey) => {
      const action = USER_BULK_ACTIONS.find((a) => a.key === actionKey);
      const rows = displayData.filter((u) => selected.includes(u.id));
      if (!action || rows.length === 0) return;

      if (action.modal === "change_role") {
        setChangeRoleTargets(rows);
        return;
      }
      if (action.handler === "toggle_active") {
        setToggleActiveTargets(rows);
        return;
      }
      if (action.confirm) {
        setPendingConfirm({ action, rows });
        return;
      }
      if (action.handler === "export") {
        // No export endpoint exists on the backend yet — placeholder only.
        console.info(
          `Export requested for ${rows.length} user(s) — backend endpoint not available yet.`,
        );
      }
    },
    [displayData, selected],
  );

  /* ─── Confirm dialog execution ─── */
  const confirmDialogCopy = useMemo(() => {
    if (!pendingConfirm) return null;
    const { action } = pendingConfirm;
    return (
      action.confirm || { title: action.label, message: "آیا مطمئن هستید؟" }
    );
  }, [pendingConfirm]);

  const runConfirmedAction = useCallback(async () => {
    if (!pendingConfirm) return;
    const { action, rows } = pendingConfirm;
    const ids = rows.map((r) => r.id);

    setConfirmLoading(true);
    try {
      if (action.key === "delete") {
        await Promise.all(ids.map((id) => remove(id)));
        toastService.success(ids.length > 1 ? `${ids.length} کاربر حذف شدند` : "کاربر حذف شد");
        refresh();
      } else if (action.key === "toggle_active") {
        if (ids.length === 1) {
          await userService.patch(ids[0], { is_active: false });
        } else {
          // Bulk: loop through each user (no bulk endpoint on backend yet)
          await Promise.all(ids.map((id) => userService.patch(id, { is_active: false })));
        }
        toastService.success(ids.length > 1 ? `${ids.length} کاربر غیرفعال شدند` : "کاربر غیرفعال شد");
        refresh();
      } else if (action.key === "reset_password") {
        // No backend endpoint exists for this at all yet (not even [PEND] in
        // apiEndpoints.js) — surfacing that rather than pretending it worked.
        console.info(
          `Password reset requested for user ${ids[0]} — no backend endpoint exists yet.`,
        );
      }
      setSelected((prev) => prev.filter((id) => !ids.includes(id)));
    } finally {
      setConfirmLoading(false);
      setPendingConfirm(null);
    }
  }, [pendingConfirm, remove, refresh]);

  /* ─── Async filter options (roles, districts, neighborhoods) ─── */
  const [filterOptions, setFilterOptions] = useState({});

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [rolesRes, districtsRes, neighborhoodsRes] = await Promise.all([
          api.get("/api/accounts/roles/"),
          api.get("/api/district/"),
          api.get("/api/neighborhoods/"),
        ]);
        if (cancelled) return;
        setFilterOptions({
          roles: (rolesRes.data || []).map((r) => ({ value: r.id, label: r.name })),
          districts: (districtsRes.data || []).map((d) => ({ value: d.id, label: d.name })),
          neighborhoods: (neighborhoodsRes.data || []).map((n) => ({ value: n.id, label: n.name })),
        });
      } catch {
        // silent — dropdowns stay empty
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  /* ─── Filters ─── */
  const filters = useMemo(
    () => ({
      schema: USER_ALL_FILTERS.filter((f) => f.type !== "search"),
      options: filterOptions,
      values: filterValues,
      onChange: setFilter,
      onClear: clearFilter,
      onClearAll: clearAll,
      activeChips,
    }),
    [filterValues, setFilter, clearFilter, clearAll, activeChips],
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

  /* ─── Page Header ─── */
  useEffect(() => {
    setPageHeader({
      title: "مدیریت کاربران",
      breadcrumb: [],
      actions: canCreateUser ? (
        <Button
          variant="primary"
          size="sm"
          className="gap-1.5"
          onClick={() => setCreating(true)}
        >
          <Plus size={16} />
          کاربر جدید
        </Button>
      ) : null,
    });

    return () => {
      setPageHeader(null);
    };
  }, [setPageHeader, meta?.count, selected.length, canCreateUser]);

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
      <div className="mb-4">
        <PageTabs items={tabItems} value={activeTab} onChange={setActiveTab} />
      </div>
      <ResourceTemplate
        search={searchConfig}
        filters={filters}
        count={meta?.count || 0}
        countLabel="کاربر"
        columns={USER_TABLE_COLUMNS}
        data={displayData}
        loading={loading}
        emptyState={emptyState}
        sort={sort}
        onSort={handleSort}
        selectable
        selected={selected}
        onSelectionChange={setSelected}
        rowActions={visibleRowActions}
        bulkActions={visibleBulkActions}
        onRowAction={handleRowAction}
        onBulkAction={handleBulkAction}
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* ─── Confirm dialog (delete / deactivate / reset password) ─── */}
      <ConfirmModal
        isOpen={pendingConfirm !== null}
        onClose={() => setPendingConfirm(null)}
        onConfirm={runConfirmedAction}
        title={confirmDialogCopy?.title || ""}
        message={confirmDialogCopy?.message || ""}
        variant={pendingConfirm?.action.key === "delete" ? "danger" : "warning"}
        isLoading={confirmLoading}
      />

      {/* ─── Detail Modal ─── */}
      {detailUser && (
        <UserDetailModal
          isOpen={!!detailUser}
          onClose={() => setDetailUser(null)}
          user={detailUser}
        />
      )}

      {/* ─── Create / Edit Modal ─── */}
      {(creating || editUser) && (
        <UserFormModal
          isOpen={creating || !!editUser}
          onClose={() => {
            setCreating(false);
            setEditUser(null);
          }}
          user={editUser}
          onSuccess={refresh}
        />
      )}

      {/* ─── Bulk: Change Role ─── */}
      {changeRoleTargets && (
        <ChangeUserRoleModal
          isOpen={!!changeRoleTargets}
          onClose={() => setChangeRoleTargets(null)}
          users={changeRoleTargets}
          onSuccess={() => {
            setChangeRoleTargets(null);
            setSelected([]);
            refresh();
          }}
        />
      )}

      {/* ─── Bulk: Toggle Active ─── */}
      {toggleActiveTargets && (
        <ToggleUserActiveModal
          isOpen={!!toggleActiveTargets}
          onClose={() => setToggleActiveTargets(null)}
          users={toggleActiveTargets}
          onSuccess={() => {
            setToggleActiveTargets(null);
            setSelected([]);
            refresh();
          }}
        />
      )}
    </>
  );
}
