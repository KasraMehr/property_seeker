import { useMemo, useState, useCallback, useEffect } from "react";
import { Plus, Eye, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useFollowup from "@/features/followups/hooks/useFollowup";
import {
  FOLLOWUP_ALL_FILTERS,
  FOLLOWUP_TABLE_COLUMNS,
} from "@/features/followups/config";
import useDebounce from "@/shared/useDebounce";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import Button from "@/shared/ui/Button";
import FollowupDetailModal from "@/features/followups/components/FollowupDetailModal";
import FollowupFormModal from "@/features/followups/components/FollowupFormModal";
import {toastService} from "@/lib/toast"

/* ─── Row Actions ─── */
const FOLLOWUP_ROW_ACTIONS = {
  admin: [
    { key: "view", label: "مشاهده", icon: Eye },
    {
      key: "edit",
      label: "ویرایش",
      icon: Eye,
      visible: (row) => row.status === "pending",
    },
    {
      key: "complete",
      label: "انجام شد",
      icon: CheckCircle2,
      visible: (row) => row.status === "pending",
    },
    {
      key: "cancel",
      label: "لغو",
      icon: XCircle,
      visible: (row) => row.status === "pending",
      variant: "danger",
    },
  ],
  operator: [
    { key: "view", label: "مشاهده", icon: Eye },
    {
      key: "complete",
      label: "انجام شد",
      icon: CheckCircle2,
      visible: (row) => row.status === "pending",
    },
    {
      key: "cancel",
      label: "لغو",
      icon: XCircle,
      visible: (row) => row.status === "pending",
      variant: "danger",
    },
  ],
};

export default function FollowupsPage() {
  const { setPageHeader } = useOutletContext();

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
    complete,
    cancel,
    refresh,
  } = useFollowup();

  const [selected, setSelected] = useState([]);
  const [pendingComplete, setPendingComplete] = useState(null);
  const [pendingCancel, setPendingCancel] = useState(null);
  const [detailFollowup, setDetailFollowup] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editFollowup, setEditFollowup] = useState(null);

  /* ─── Page Header ─── */
  useEffect(() => {
    setPageHeader({
      title: "مدیریت پیگیری‌ها",
      breadcrumb: [],
      actions: (
        <Button
          variant="primary"
          size="sm"
          className="gap-1.5"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={16} />
          پیگیری جدید
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

  /* ─── Row actions ─── */
  const handleRowAction = useCallback((actionKey, row) => {
    switch (actionKey) {
      case "view":
        setDetailFollowup(row);
        break;

      case "edit":
        setEditFollowup(row);
        break;

      case "complete":
        setPendingComplete(row);
        break;

      case "cancel":
        setPendingCancel(row);
        break;

      default:
        break;
    }
  }, []);

  /* ─── Confirm handlers ─── */
  const confirmComplete = useCallback(async () => {
    if (!pendingComplete) return;

    await complete(pendingComplete.id);
    setPendingComplete(null);
    toastService.success("تغییر موفق")
  }, [pendingComplete, complete]);

  const confirmCancel = useCallback(async () => {
    if (!pendingCancel) return;

    await cancel(pendingCancel.id);
    setPendingCancel(null);
  }, [pendingCancel, cancel]);

  /* ─── Filter options ─── */
  const filterOptions = useMemo(() => {
    const statusFilter = FOLLOWUP_ALL_FILTERS.find((f) => f.key === "status");
    const typeFilter = FOLLOWUP_ALL_FILTERS.find((f) => f.key === "type");

    return {
      statuses: statusFilter?.options || [],
      types: typeFilter?.options || [],
    };
  }, []);

  const filters = useMemo(
    () => ({
      schema: FOLLOWUP_ALL_FILTERS.filter((f) => {
        if (f.type === "search") return false;
        if (!isAdmin && f.key === "user") return false;
        return true;
      }),
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
      placeholder: "عنوان، توضیحات، نام مشتری...",
    }),
    [searchInput],
  );

  /* ─── Empty ─── */
  const emptyState = useMemo(
    () => (
      <div className="py-12 text-center space-y-3">
        <Clock size={48} className="mx-auto text-muted/40" />

        <div>
          <p className="text-sm font-medium text-foreground">
            پیگیری‌ای یافت نشد
          </p>

          <p className="text-xs text-muted mt-1">
            با فیلترهای انتخابی هیچ پیگیری‌ای پیدا نشد.
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
        countLabel="پیگیری"
        columns={FOLLOWUP_TABLE_COLUMNS}
        data={data}
        loading={loading}
        emptyState={emptyState}
        sort={sort}
        onSort={handleSort}
        selectable={true}
        selected={selected}
        onSelectionChange={setSelected}
        rowActions={FOLLOWUP_ROW_ACTIONS[role]}
        onRowAction={handleRowAction}
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Confirm Complete */}
      <ConfirmModal
        isOpen={pendingComplete !== null}
        onClose={() => setPendingComplete(null)}
        onConfirm={confirmComplete}
        title="تکمیل پیگیری"
        message={`پیگیری «${pendingComplete?.title || ""}» به وضعیت «انجام شده» تغییر خواهد کرد.`}
        variant="info"
        confirmLabel="تکمیل"
      />

      {/* Confirm Cancel */}
      <ConfirmModal
        isOpen={pendingCancel !== null}
        onClose={() => setPendingCancel(null)}
        onConfirm={confirmCancel}
        title="لغو پیگیری"
        message={`پیگیری «${pendingCancel?.title || ""}» لغو خواهد شد. آیا مطمئن هستید؟`}
        variant="danger"
        confirmLabel="لغو"
      />

      {/* Detail Modal */}
      {detailFollowup && (
        <FollowupDetailModal
          isOpen={!!detailFollowup}
          onClose={() => setDetailFollowup(null)}
          followup={detailFollowup}
          onMarkDone={(item) => {
            setPendingComplete(item);
            setDetailFollowup(null);
          }}
        />
      )}

      {/* Create Modal */}
      <FollowupFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={refresh}
      />

      {/* Edit Modal */}
      <FollowupFormModal
        isOpen={!!editFollowup}
        onClose={() => setEditFollowup(null)}
        followup={editFollowup}
        onSuccess={refresh}
      />
    </>
  );
}
