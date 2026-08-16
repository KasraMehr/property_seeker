import { useState, useMemo, useCallback, useEffect } from "react";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import useScraper from "../../hooks/useScraper";
import {
  SCRAPER_RUN_TABLE_COLUMNS,
  SCRAPER_RUN_ROW_ACTIONS,
} from "../../config";
import ScraperRunDetailModal from "../ScraperRunDetailModal";
import EmptyState from "./EmptyState";
import { toastService } from "@/lib/toast";

export default function RunsTab({ onHeaderStateChange }) {
  const { runs, loading, meta, page, setPage, fetchRuns, resumeRun } =
    useScraper();

  const [detailRun, setDetailRun] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleRowAction = useCallback(
    async (key, row) => {
      switch (key) {
        case "view":
        case "view_items":
        case "view_errors":
          setDetailRun(row);
          break;
        case "resume":
          try {
            await resumeRun(row.id);
            toastService.success("اجرا از سر گرفته شد");
            await fetchRuns({ page });
          } catch (err) {
            console.error(err);
            toastService.error("ادامه اجرا ناموفق بود");
          }
          break;
        default:
          break;
      }
    },
    [resumeRun, fetchRuns, page],
  );

  const pagination = useMemo(
    () => ({
      page,
      totalPages: Math.max(1, Math.ceil((meta?.count || 0) / 20)),
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
          selectable={false}
          rowActions={SCRAPER_RUN_ROW_ACTIONS}
          onRowAction={handleRowAction}
          pagination={pagination}
          onPageChange={setPage}
          emptyState={<EmptyState message="اجرایی ثبت نشده" />}
        />
      </div>

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