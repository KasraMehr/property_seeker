import { useMemo, useState, useCallback, useEffect } from "react";
import { Plus, Phone } from "lucide-react";
import { useOutletContext } from "react-router-dom";

import useAuth from "@/features/auth/hooks/useAuth";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useCall from "@/features/calls/hooks/useCall";
import {
  CALL_ALL_FILTERS,
  CALL_ROW_ACTIONS,
  CALL_BULK_ACTIONS,
  CALL_ALL_ACTIONS,
  CALL_TABLE_COLUMNS,
} from "@/features/calls/config";
import useDebounce from "@/shared/useDebounce";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import FollowUpModal from "../../followups/components/QuickFollowupModal";
import Button from "@/shared/ui/Button";
import CallDetailModal from "@/features/calls/components/CallDetailModal";
import CallFormModal from "@/features/calls/components/CallFormModal";
import { toastService } from "@/lib/toast";

export default function CallsPage() {
  const { user } = useAuth();
  const { setPageHeader } = useOutletContext();

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
    remove,
    getById,
    markFollowUpDone,
    bulkRemove,
    refresh,
  } = useCall();

  const [selected, setSelected] = useState([]);
  const [detailCall, setDetailCall] = useState(null);
  const [editCall, setEditCall] = useState(null);
  const [followUpCall, setFollowUpCall] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  /* ─── Page Header ─── */
  useEffect(() => {
    setPageHeader({
      title: "مدیریت تماس‌ها",
      breadcrumb: [],
      actions: (
        <Button
          variant="primary"
          size="sm"
          className="gap-1.5"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={16} />
          تماس جدید
        </Button>
      ),
    });

    return () => {
      setPageHeader(null);
    };
  }, [setPageHeader, meta?.count]);

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
      const dir =
        sort?.key === key && sort?.dir === "asc" ? "desc" : "asc";

      setOrdering(`${dir === "desc" ? "-" : ""}${key}`);
    },
    [sort, setOrdering]
  );

  /* ─── Row actions ─── */
  const handleRowAction = useCallback(
    async (actionKey, row) => {
      const action = CALL_ALL_ACTIONS.find((a) => a.key === actionKey);

      if (action?.confirm) {
        setPendingAction({
          key: actionKey,
          row,
          confirm: action.confirm,
        });
        return;
      }

      switch (actionKey) {
        case "view": {
          const full = await getById(row.id);
          setDetailCall(full);
          break;
        }

        case "edit": {
          const full = await getById(row.id);
          setEditCall(full);
          break;
        }

        case "mark_follow_up_done":
          try {
            await markFollowUpDone(row.id);
            toastService.success("پیگیری با موفقیت انجام شد.");
          } catch {
            toastService.error("خطا در ثبت پیگیری.");
          }
          break;

        case "add_followup":
          setFollowUpCall(row);
          break;

        default:
          break;
      }
    },
    [getById, markFollowUpDone]
  );

  /* ─── Confirm action handler ─── */
  const confirmAction = useCallback(async () => {
    if (!pendingAction) return;

    const { key, row } = pendingAction;

    if (key === "delete") {
      try {
        await remove(row.id);
        setSelected((prev) => prev.filter((id) => id !== row.id));
        toastService.success("تماس با موفقیت حذف شد.");
      } catch {
        toastService.error("خطا در حذف تماس.");
      }
    }

    setPendingAction(null);
  }, [pendingAction, remove]);

  /* ─── Bulk ─── */
  const handleBulkAction = useCallback(
    async (actionKey) => {
      if (actionKey === "delete" && selected.length > 0) {
        try {
          await bulkRemove(selected);
          setSelected([]);
          toastService.success("تماس‌ها با موفقیت حذف شدند.");
        } catch {
          toastService.error("خطا در حذف تماس‌ها.");
        }
      }
    },
    [selected, bulkRemove]
  );

  /* ─── Filter options ─── */
  const filterOptions = useMemo(() => {
    const typeFilter = CALL_ALL_FILTERS.find(
      (f) => f.key === "call_type"
    );

    const resultFilter = CALL_ALL_FILTERS.find(
      (f) => f.key === "result"
    );

    return {
      callTypes: typeFilter?.options || [],
      results: resultFilter?.options || [],
    };
  }, []);

  const filters = useMemo(
    () => ({
      schema: CALL_ALL_FILTERS.filter((f) => f.type !== "search"),
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
    ]
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
      placeholder: "یادداشت، نام مشتری، کد ملک...",
    }),
    [searchInput]
  );

  /* ─── Empty ─── */
  const emptyState = useMemo(
    () => (
      <div className="py-12 text-center space-y-3">
        <Phone size={48} className="mx-auto text-muted/40" />

        <div>
          <p className="text-sm font-medium text-foreground">
            تماسی یافت نشد
          </p>

          <p className="text-xs text-muted mt-1">
            با فیلترهای انتخابی هیچ تماسی پیدا نشد.
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
        search={searchConfig}
        filters={filters}
        count={meta?.count || 0}
        countLabel="تماس"
        columns={CALL_TABLE_COLUMNS}
        data={data}
        loading={loading}
        emptyState={emptyState}
        sort={sort}
        onSort={handleSort}
        selectable={true}
        selected={selected}
        onSelectionChange={setSelected}
        rowActions={CALL_ROW_ACTIONS}
        bulkActions={isAdmin ? CALL_BULK_ACTIONS : []}
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
      <CallDetailModal
        isOpen={!!detailCall}
        onClose={() => setDetailCall(null)}
        call={detailCall}
      />

      {/* Create Modal */}
      <CallFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={refresh}
      />

      {/* Edit Modal */}
      <CallFormModal
        isOpen={!!editCall}
        onClose={() => setEditCall(null)}
        call={editCall}
        onSuccess={refresh}
      />

      {/* Follow-up Modal */}
      <FollowUpModal
        isOpen={!!followUpCall}
        onClose={() => setFollowUpCall(null)}
        call={followUpCall}
      />
    </>
  );
}