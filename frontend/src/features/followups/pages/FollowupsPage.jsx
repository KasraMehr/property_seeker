import { useMemo, useState, useCallback, useEffect } from "react";
import { Plus, Eye, Pencil, CheckCircle2, XCircle, Clock, Trash2, Play } from "lucide-react";
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

/* ─── Supademo Demo Popup ─── */
// const SUPADEMO_DEMO_ID = "cmtmk64e90jdcqmh5vc7vae5e";
// const SUPADEMO_SCRIPT_SRC = "https://script.supademo.com/supademo.js";

// let supademoScriptPromise = null;

/** Load the Supademo script once, then resolve. */
function loadSupademoScript() {
  if (window.Supademo) return Promise.resolve();

  if (!supademoScriptPromise) {
    supademoScriptPromise = new Promise((resolve, reject) => {
      const onLoad = () => resolve();
      const onError = () => reject(new Error("Supademo script failed to load."));

      const existing = document.getElementById("supademo-script");
      if (existing) {
        existing.addEventListener("load", onLoad, { once: true });
        existing.addEventListener("error", onError, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.id = "supademo-script";
      script.src = SUPADEMO_SCRIPT_SRC;
      script.async = true;
      script.addEventListener("load", onLoad, { once: true });
      script.addEventListener("error", onError, { once: true });
      document.body.appendChild(script);
    });

    // Allow a later retry if loading ever fails.
    supademoScriptPromise.catch(() => {
      supademoScriptPromise = null;
    });
  }

  return supademoScriptPromise;
}

/* ─── Row Actions ─── */
const FOLLOWUP_ROW_ACTIONS = {
  admin: [
    { key: "view", label: "مشاهده", icon: Eye },
    {
      key: "edit",
      label: "ویرایش",
      icon: Pencil,
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
    {
      key: "delete",
      label: "حذف",
      icon: Trash2,
      danger: true,
    },
  ],
  operator: [
    { key: "view", label: "مشاهده", icon: Eye },
    {
      key: "edit",
      label: "ویرایش",
      icon: Pencil,
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
    {
      key: "delete",
      label: "حذف",
      icon: Trash2,
      danger: true,
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
    remove,
    refresh,
  } = useFollowup();

  const [selected, setSelected] = useState([]);
  const [pendingComplete, setPendingComplete] = useState(null);
  const [pendingCancel, setPendingCancel] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [detailFollowup, setDetailFollowup] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editFollowup, setEditFollowup] = useState(null);

  /* ─── Page Header ─── */
  useEffect(() => {
    setPageHeader({
      title: "مدیریت پیگیری‌ها",
      subtitle:"ثبت یادآوری ها برای مشتریان و املاک",
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

      case "delete":
        setPendingAction({ key: "delete", row, confirm: { title: "حذف پیگیری", message: `آیا از حذف «${row.title}» اطمینان دارید؟` } });
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
    toastService.success("پیگیری لغو شد.");
  }, [pendingCancel, cancel]);

  const confirmAction = useCallback(async () => {
    if (!pendingAction) return;

    if (pendingAction.key === "delete") {
      await remove(pendingAction.row.id);
      toastService.success("پیگیری حذف شد.");
    }

    setPendingAction(null);
  }, [pendingAction, remove]);

  /* ─── Demo tour popup (Supademo) ─── */
  const openDemoTour = useCallback(async () => {
    try {
      await loadSupademoScript();
      window.Supademo?.open(SUPADEMO_DEMO_ID);
    } catch {
      toastService.error("خطا در بارگذاری دمو.");
    }
  }, []);

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

  /* ─── Sorted data: today first → upcoming → past/canceled last ─── */
  const sortedData = useMemo(() => {
    if (!data?.length) return data;
    const now = new Date();
    const todayStr = now.toDateString();

    const getSortWeight = (item) => {
      if (item.status !== "pending") return 3; // done/canceled → last
      const due = new Date(item.due_at);
      const dueStr = due.toDateString();
      if (dueStr === todayStr) return 0; // today → first
      if (due > now) return 1; // upcoming → second
      return 2; // overdue → third
    };

    return [...data].sort((a, b) => {
      const wa = getSortWeight(a);
      const wb = getSortWeight(b);
      if (wa !== wb) return wa - wb;
      // within same group, sort by due_at ascending
      return new Date(a.due_at) - new Date(b.due_at);
    });
  }, [data]);

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

  /* ─── Table Columns (conditional based on isAdmin) ─── */
  const tableColumns = useMemo(() => {
    if (isAdmin) return FOLLOWUP_TABLE_COLUMNS;
    return FOLLOWUP_TABLE_COLUMNS.filter((col) => col.key !== "user_name");
  }, [isAdmin]);

  return (
    <>
      <ResourceTemplate
        search={searchConfig}
        filters={filters}
        count={meta?.count || 0}
        countLabel="پیگیری"
        columns={tableColumns}
        data={sortedData}
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
      {detailFollowup && (
        <FollowupDetailModal
          isOpen={!!detailFollowup}
          onClose={() => setDetailFollowup(null)}
          followup={detailFollowup}
          onEdit={(item) => {
            setDetailFollowup(null);
            setEditFollowup(item);
          }}
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

      {/* Demo tour popup (Supademo) — fixed bottom-left */}
      {/* <Button
        variant="demo"
        icon={Play}
        className="fixed bottom-5 left-5 z-40 gap-2"
        onClick={openDemoTour}
      >
        راهنما
      </Button> */}
    </>
  );
}
