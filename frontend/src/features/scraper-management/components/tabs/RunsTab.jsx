import { useState, useMemo, useCallback, useEffect } from "react";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useScraper from "../../hooks/useScraper";
import {
  SCRAPER_RUN_TABLE_COLUMNS,
  SCRAPER_RUN_ROW_ACTIONS,
  SCRAPER_RUN_BULK_ACTIONS,
} from "../../config";
import ScraperRunDetailModal from "../ScraperRunDetailModal";
import EmptyState from "./EmptyState";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import { toastService } from "@/lib/toast";

export default function RunsTab({ onHeaderStateChange }) {
  const {
    runs,
    loading,
    meta,
    page,
    setPage,
    fetchRuns,
    resumeRun,
    cancelRun,
    deleteRun,
    bulkCancelRuns,
    bulkDeleteRuns,
  } = useScraper();

  const [selected, setSelected] = useState([]);
  const [detailRun, setDetailRun] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    fetchRuns({ page });
  }, [fetchRuns, page]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchRuns({ page });
    } finally {
      setRefreshing(false);
    }
  }, [fetchRuns, page]);

  useEffect(() => {
    onHeaderStateChange?.({
      loading: loading || refreshing,
      onRefresh: handleRefresh,
    });
    return () => onHeaderStateChange?.(null);
  }, [loading, refreshing, handleRefresh, onHeaderStateChange]);

  /* ─── Row actions ─── */
  const handleRowAction = useCallback(
    async (key, row) => {
      const action = SCRAPER_RUN_ROW_ACTIONS.find((a) => a.key === key);
      if (!action) return;

      // Actions with confirm block go through ConfirmModal
      if (action.confirm) {
        setPendingConfirm({ action, rows: [row] });
        return;
      }

      switch (key) {
        case "view":
        case "view_items":
        case "view_errors":
          setDetailRun(row);
          break;
        default:
          break;
      }
    },
    [],
  );

  /* ─── Bulk actions ─── */
  const handleBulkAction = useCallback(
    (actionKey) => {
      if (selected.length === 0) return;
      const action = SCRAPER_RUN_BULK_ACTIONS.find(
        (a) => a.key === actionKey,
      );
      const rows = (runs || []).filter((r) => selected.includes(r.id));
      if (!action || rows.length === 0) return;

      // bulk_toggle: per-row invert (active→cancel, inactive→resume)
      if (action.handler === "bulk_toggle") {
        const cancel_ids = [];
        const resume_ids = [];
        for (const row of rows) {
          if (row.status === "queued" || row.status === "running") {
            cancel_ids.push(row.id);
          } else if (row.status === "failed" || row.status === "cancelled") {
            resume_ids.push(row.id);
          }
        }
        if (cancel_ids.length === 0 && resume_ids.length === 0) {
          toastService.error("هیچ اجرای قابل تغییری در انتخاب‌ها وجود ندارد");
          return;
        }
        bulkCancelRuns(cancel_ids, resume_ids)
          .then(() => {
            setSelected([]);
            const total = cancel_ids.length + resume_ids.length;
            toastService.success(`${total} اجرا بروزرسانی شد`);
          })
          .catch((err) => {
            console.error(err);
            const detail =
              err?.response?.data?.detail || "تغییر وضعیت گروهی ناموفق بود.";
            toastService.error(detail);
          });
        return;
      }

      // Actions with confirm block go through ConfirmModal
      if (action.confirm) {
        setPendingConfirm({ action, rows });
        return;
      }
    },
    [selected, runs, bulkCancelRuns],
  );

  /* ─── Confirm dialog copy ─── */
  const confirmDialogCopy = useMemo(() => {
    if (!pendingConfirm) return null;
    const { action } = pendingConfirm;
    return (
      action.confirm || {
        title: action.label,
        message: "آیا مطمئن هستید؟",
      }
    );
  }, [pendingConfirm]);

  /* ─── Execute confirmed action ─── */
  const runConfirmedAction = useCallback(async () => {
    if (!pendingConfirm) return;
    const { action, rows } = pendingConfirm;
    const ids = rows.map((r) => r.id);

    setConfirmLoading(true);
    try {
      if (action.handler === "bulk_delete") {
        await bulkDeleteRuns(ids);
        setSelected([]);
        toastService.success(
          ids.length > 1
            ? `${ids.length} اجرا حذف شدند`
            : "اجرا حذف شد",
        );
      } else if (action.key === "delete") {
        await deleteRun(ids[0]);
        toastService.success("اجرا حذف شد");
      } else if (action.key === "cancel") {
        await cancelRun(ids[0]);
        toastService.success("اجرا متوقف شد");
      } else if (action.key === "resume") {
        await resumeRun(ids[0]);
        toastService.success("اجرا از سر گرفته شد");
      }
      await fetchRuns({ page });
    } catch (err) {
      console.error(err);
      const detail =
        err?.response?.data?.detail || "عملیات ناموفق بود.";
      toastService.error(detail);
    } finally {
      setConfirmLoading(false);
      setPendingConfirm(null);
    }
  }, [
    pendingConfirm,
    bulkDeleteRuns,
    deleteRun,
    cancelRun,
    resumeRun,
    fetchRuns,
    page,
  ]);

  const pagination = useMemo(
    () => ({
      page,
      totalPages: Math.max(1, Math.ceil((meta?.count || 0) / 10)),
    }),
    [page, meta],
  );

  return (
    <>
      <div className="flex h-full flex-col min-h-0">
        <ResourceTemplate
          count={meta?.count || 0}
          countLabel="اجرا"
          columns={SCRAPER_RUN_TABLE_COLUMNS}
          data={runs}
          loading={loading || refreshing}
          selectable
          selected={selected}
          onSelectionChange={setSelected}
          rowActions={SCRAPER_RUN_ROW_ACTIONS}
          bulkActions={SCRAPER_RUN_BULK_ACTIONS}
          onRowAction={handleRowAction}
          onBulkAction={handleBulkAction}
          pagination={pagination}
          onPageChange={setPage}
          emptyState={<EmptyState message="اجرایی ثبت نشده" />}
        />
      </div>

      {/* ─── Confirm dialog ─── */}
      <ConfirmModal
        isOpen={pendingConfirm !== null}
        onClose={() => setPendingConfirm(null)}
        onConfirm={runConfirmedAction}
        title={confirmDialogCopy?.title || ""}
        message={confirmDialogCopy?.message || ""}
        variant={
          pendingConfirm?.action.variant === "danger" ? "danger" : "warning"
        }
        isLoading={confirmLoading}
      />

      {detailRun && (
        <ScraperRunDetailModal
          isOpen={!!detailRun}
          onClose={() => setDetailRun(null)}
          run={detailRun}
        />
      )}
    </>
  );
}