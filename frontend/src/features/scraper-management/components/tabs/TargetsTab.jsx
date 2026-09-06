import { useState, useMemo, useCallback, useEffect } from "react";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useScraper from "../../hooks/useScraper";
import {
  SCRAPER_TARGET_TABLE_COLUMNS,
  SCRAPER_TARGET_ROW_ACTIONS,
} from "../../config";
import ScraperTargetDetailModal from "../ScraperTargetDetailModal";
import ScraperTargetFormModal from "../ScraperTargetFormModal";
import TriggerScraperRunModal from "../TriggerScraperRunModal";
import TargetPickerModal from "../TargetPickerModal";
import EmptyState from "./EmptyState";
import { toastService } from "@/lib/toast";

/**
 * onHeaderStateChange({ loading, canTrigger, onRefresh, onOpenTrigger }) | null
 */
export default function TargetsTab({
  refreshKey,
  onRunTriggered,
  onHeaderStateChange,
}) {
  const { targets, loading, meta, page, setPage, fetchTargets, toggleTarget, deleteTarget } =
    useScraper();

  const [selected, setSelected] = useState([]);
  const [detailTarget, setDetailTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [triggerTarget, setTriggerTarget] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTargets({ page });
  }, [fetchTargets, page, refreshKey]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchTargets({ page });
    } finally {
      setRefreshing(false);
    }
  }, [fetchTargets, page]);

  const enabledTargets = useMemo(
    () => (targets || []).filter((t) => t.enabled),
    [targets],
  );

  const openTriggerPicker = useCallback(() => {
    setPickerOpen(true);
  }, []);

  // Action buttons 
  useEffect(() => {
    onHeaderStateChange?.({
      loading: loading || refreshing,
      canTrigger: enabledTargets.length > 0,
      onRefresh: handleRefresh,
      onOpenTrigger: openTriggerPicker,
    });
    return () => onHeaderStateChange?.(null);
  }, [
    loading,
    refreshing,
    enabledTargets.length,
    handleRefresh,
    openTriggerPicker,
    onHeaderStateChange,
  ]);

  const handleRowAction = useCallback(
    async (key, row) => {
      switch (key) {
        case "view":
          setDetailTarget(row);
          break;
        case "edit":
          setEditTarget(row);
          break;
        case "toggle_enabled":
        case "toggle_enabled_activate":
          try {
            await toggleTarget(row.id, row.enabled);
            toastService.success(
              row.enabled ? "تارگت غیرفعال شد" : "تارگت فعال شد",
            );
          } catch (err) {
            console.error(err);
            toastService.error("تغییر وضعیت ناموفق بود");
          }
          break;
        case "trigger_run":
          if (!row.enabled) {
            toastService.error("اول تارگت را فعال کنید");
            return;
          }
          setTriggerTarget(row);
          break;
        case "delete":
          try {
            await deleteTarget(row.id);
            toastService.success("تارگت حذف شد");
          } catch (err) {
            console.error(err);
            const detail =
              err?.response?.data?.detail ||
              err?.response?.data?.error ||
              "حذف تارگت ناموفق بود.";
            toastService.error(detail);
          }
          break;
        default:
          break;
      }
    },
    [toggleTarget, deleteTarget],
  );

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
          countLabel="تارگت"
          columns={SCRAPER_TARGET_TABLE_COLUMNS}
          data={targets}
          loading={loading || refreshing}
          selectable
          selected={selected}
          onSelectionChange={setSelected}
          rowActions={SCRAPER_TARGET_ROW_ACTIONS}
          bulkActions={[]}
          onRowAction={handleRowAction}
          pagination={pagination}
          onPageChange={setPage}
          emptyState={<EmptyState message="تارگتی ثبت نشده" />}
        />
      </div>

      {detailTarget && (
        <ScraperTargetDetailModal
          isOpen={!!detailTarget}
          onClose={() => setDetailTarget(null)}
          target={detailTarget}
        />
      )}

      {editTarget && (
        <ScraperTargetFormModal
          isOpen
          onClose={() => setEditTarget(null)}
          target={editTarget}
          onSuccess={() => {
            setEditTarget(null);
            fetchTargets({ page });
            toastService.success("تارگت ویرایش شد");
          }}
        />
      )}

      <TargetPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        targets={enabledTargets}
        onPick={(target) => {
          setPickerOpen(false);
          setTriggerTarget(target);
        }}
      />

      {triggerTarget && (
        <TriggerScraperRunModal
          isOpen={!!triggerTarget}
          onClose={() => setTriggerTarget(null)}
          target={triggerTarget}
          onSuccess={() => {
            fetchTargets({ page });
            toastService.success("اجرا شروع شد");
            onRunTriggered?.();
          }}
        />
      )}
    </>
  );
}