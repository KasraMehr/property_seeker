import { useState, useMemo, useCallback, useEffect } from "react";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useDebounce from "@/shared/useDebounce";
import useResourceQuery from "@/shared/templates/resource/hooks/useResourceQuery";
import useScraper from "../../hooks/useScraper";
import scraperService from "../../services/scraperService";
import {
  SCRAPER_TARGET_TABLE_COLUMNS,
  SCRAPER_TARGET_ROW_ACTIONS,
  SCRAPER_TARGET_BULK_ACTIONS,
  SCRAPER_TARGET_FILTERS,
} from "../../config";
import ScraperTargetDetailModal from "../ScraperTargetDetailModal";
import ScraperTargetFormModal from "../ScraperTargetFormModal";
import TriggerScraperRunModal from "../TriggerScraperRunModal";
import TargetPickerModal from "../TargetPickerModal";
import EmptyState from "./EmptyState";
import ConfirmModal from "@/shared/ui/modal/ConfirmModal";
import { toastService } from "@/lib/toast";

/**
 * onHeaderStateChange({ loading, canTrigger, onRefresh, onOpenTrigger }) | null
 */
export default function TargetsTab({
  refreshKey,
  onRunTriggered,
  onHeaderStateChange,
}) {
  const { targets, loading, meta, page, setPage, fetchTargets, toggleTarget, deleteTarget, bulkDeleteTargets, bulkToggleTargets } =
    useScraper();

  const [selected, setSelected] = useState([]);
  const [detailTarget, setDetailTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [triggerTarget, setTriggerTarget] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  /* ─── Filters (URL-synced) ─── */
  const query = useResourceQuery({
    filterSchema: SCRAPER_TARGET_FILTERS,
    syncToUrl: true,
  });
  const filterParams = useMemo(() => {
    // eslint-disable-next-line no-unused-vars
    const { page: _p, page_size: _ps, ordering: _o, ...params } = query.queryParams;
    return params;
  }, [query.queryParams]);

  /* ─── Zone options for the zone multi-select ─── */
  const [zoneOptions, setZoneOptions] = useState([]);
  useEffect(() => {
    let cancelled = false;
    scraperService
      .getZones({ active: true })
      .then((res) => {
        if (cancelled) return;
        const zones = Array.isArray(res?.data) ? res.data : (res?.data?.results ?? []);
        setZoneOptions(zones.map((z) => ({ value: z.id, label: z.name })));
      })
      .catch((err) => console.error("failed to load zones", err));
    return () => {
      cancelled = true;
    };
  }, []);

  /* ─── Search ─── */
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  // Reset page whenever filters or search change
  useEffect(() => {
    setPage(1);
  }, [filterParams, debouncedSearch, setPage]);

  const loadData = useCallback(
    () => fetchTargets({ ...filterParams, page, search: debouncedSearch }),
    [fetchTargets, filterParams, page, debouncedSearch],
  );

  useEffect(() => {
    loadData();
  }, [loadData, refreshKey]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

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
      const action = SCRAPER_TARGET_ROW_ACTIONS.find((a) => a.key === key);
      if (!action) return;

      // Actions that need confirmation go through ConfirmModal
      if (action.confirm) {
        setPendingConfirm({ action, rows: [row] });
        return;
      }

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
        default:
          break;
      }
    },
    [toggleTarget],
  );

  const handleBulkAction = useCallback(
    (actionKey) => {
      if (selected.length === 0) return;
      const action = SCRAPER_TARGET_BULK_ACTIONS.find((a) => a.key === actionKey);
      const rows = (targets || []).filter((t) => selected.includes(t.id));
      if (!action || rows.length === 0) return;

      // trigger_run opens the modal for the first enabled target directly
      if (action.handler === "trigger_run") {
        const firstEnabled = rows.find((r) => r.enabled);
        if (!firstEnabled) {
          toastService.error("هیچ تارگت فعالی در انتخاب‌ها وجود ندارد");
          return;
        }
        setTriggerTarget(firstEnabled);
        return;
      }

      // Actions with confirm block go through ConfirmModal
      if (action.confirm) {
        setPendingConfirm({ action, rows });
        return;
      }

      // toggle_enabled without confirm — execute directly
      if (action.handler === "toggle_enabled") {
        const enable_ids = [];
        const disable_ids = [];
        for (const row of rows) {
          if (row.enabled) disable_ids.push(row.id);
          else enable_ids.push(row.id);
        }
        bulkToggleTargets(enable_ids, disable_ids)
          .then(() => {
            setSelected([]);
            toastService.success(`${rows.length} تارگت بروزرسانی شد`);
          })
          .catch((err) => {
            console.error(err);
            toastService.error("تغییر وضعیت گروهی ناموفق بود");
          });
      }
    },
    [selected, targets, bulkToggleTargets],
  );

  /* ─── Confirm dialog copy ─── */
  const confirmDialogCopy = useMemo(() => {
    if (!pendingConfirm) return null;
    const { action } = pendingConfirm;
    return action.confirm || { title: action.label, message: "آیا مطمئن هستید؟" };
  }, [pendingConfirm]);

  /* ─── Execute confirmed action ─── */
  const runConfirmedAction = useCallback(async () => {
    if (!pendingConfirm) return;
    const { action, rows } = pendingConfirm;
    const ids = rows.map((r) => r.id);

    setConfirmLoading(true);
    try {
      if (action.handler === "bulk_delete") {
        await bulkDeleteTargets(ids);
        setSelected([]);
        toastService.success(
          ids.length > 1 ? `${ids.length} تارگت حذف شدند` : "تارگت حذف شد",
        );
      } else if (action.handler === "toggle_enabled") {
        const enable_ids = [];
        const disable_ids = [];
        for (const row of rows) {
          if (row.enabled) disable_ids.push(row.id);
          else enable_ids.push(row.id);
        }
        await bulkToggleTargets(enable_ids, disable_ids);
        setSelected([]);
        toastService.success(`${ids.length} تارگت بروزرسانی شد`);
      } else if (action.key === "delete") {
        await deleteTarget(ids[0]);
        toastService.success("تارگت حذف شد");
      } else if (action.key === "trigger_run") {
        // Single row confirm — open trigger modal
        setTriggerTarget(rows[0]);
      }
    } catch (err) {
      console.error(err);
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "عملیات ناموفق بود.";
      toastService.error(detail);
    } finally {
      setConfirmLoading(false);
      setPendingConfirm(null);
    }
  }, [pendingConfirm, bulkDeleteTargets, bulkToggleTargets, deleteTarget]);

  const pagination = useMemo(
    () => ({
      page,
      totalPages: Math.max(1, Math.ceil((meta?.count || 0) / 10)),
    }),
    [page, meta],
  );

  const searchConfig = useMemo(
    () => ({
      value: searchInput,
      onChange: setSearchInput,
      label: "جستجو",
      placeholder: "جستجو (نام، آدرس، منطقه)...",
    }),
    [searchInput],
  );

  const filtersConfig = useMemo(
    () => ({
      schema: SCRAPER_TARGET_FILTERS,
      options: { zone: zoneOptions },
      values: query.filters,
      onChange: query.setFilter,
      onClear: query.clearFilter,
      onClearAll: query.clearAll,
      activeChips: query.activeChips,
    }),
    [zoneOptions, query.filters, query.setFilter, query.clearFilter, query.clearAll, query.activeChips],
  );

  return (
    <>
      <div className="flex h-full flex-col min-h-0">
        <ResourceTemplate
          count={meta?.count || 0}
          countLabel="تارگت"
          search={searchConfig}
          filters={filtersConfig}
          columns={SCRAPER_TARGET_TABLE_COLUMNS}
          data={targets}
          loading={loading || refreshing}
          selectable
          selected={selected}
          onSelectionChange={setSelected}
          rowActions={SCRAPER_TARGET_ROW_ACTIONS}
          bulkActions={SCRAPER_TARGET_BULK_ACTIONS}
          onRowAction={handleRowAction}
          onBulkAction={handleBulkAction}
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
            loadData();
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

      {/* ─── Confirm dialog ─── */}
      <ConfirmModal
        isOpen={pendingConfirm !== null}
        onClose={() => setPendingConfirm(null)}
        onConfirm={runConfirmedAction}
        title={confirmDialogCopy?.title || ""}
        message={confirmDialogCopy?.message || ""}
        variant={pendingConfirm?.action.variant === "danger" ? "danger" : "warning"}
        isLoading={confirmLoading}
      />

      {triggerTarget && (
        <TriggerScraperRunModal
          isOpen={!!triggerTarget}
          onClose={() => setTriggerTarget(null)}
          target={triggerTarget}
          onSuccess={() => {
            loadData();
            toastService.success("اجرا شروع شد");
            onRunTriggered?.();
          }}
        />
      )}
    </>
  );
}