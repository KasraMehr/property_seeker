// src/features/scraper-management/pages/ScraperPage.jsx
import { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, Inbox } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import PageTabs from "@/shared/page/PageTabs";
import ResourceTemplate from "@/shared/templates/resource/ResourceTemplate";
import Button from "@/shared/ui/Button";
import useScraper from "../hooks/useScraper";
import {
  SCRAPER_TARGET_TABLE_COLUMNS,
  SCRAPER_TARGET_ROW_ACTIONS,
  SCRAPER_TARGET_BULK_ACTIONS,
  SCRAPER_RUN_TABLE_COLUMNS,
  SCRAPER_RUN_ROW_ACTIONS,
} from "../config";
import ScraperTargetDetailModal from "../components/ScraperTargetDetailModal";
import ScraperTargetFormModal from "../components/ScraperTargetFormModal";
import TriggerScraperRunModal from "../components/TriggerScraperRunModal";
import ScraperRunDetailModal from "../components/ScraperRunDetailModal";

const TABS = [
  { id: "targets", label: "تارگت‌ها" },
  { id: "runs", label: "اجراها" },
  { id: "listings", label: "آگهی‌های اسکرپ‌شده" },
];

export default function ScraperPage() {
  const [activeTab, setActiveTab] = useState("targets");
  const [formTarget, setFormTarget] = useState(null);
  const [targetsRefreshKey, setTargetsRefreshKey] = useState(0);

  const { setPageHeader } = useOutletContext();

  useEffect(() => {
    setPageHeader({
      title: "مدیریت اسکرپر",
      subtitle: "تنظیمات تارگت‌ها، اجراها و آگهی‌های دریافتی از دیوار",
      breadcrumb: [],
      actions: (
        <Button variant="primary" size="sm" onClick={() => setFormTarget({})}>
          <Plus size={16} />
          تارگت جدید
        </Button>
      ),
    });

    return () => {
      setPageHeader(null);
    };
  }, [setPageHeader]);

  return (
    <>
      <div className="flex h-full flex-col space-y-4">
        <PageTabs items={TABS} value={activeTab} onChange={setActiveTab} />

        <div className="min-h-0 flex-1">
          {activeTab === "targets" && (
            <TargetsTab refreshKey={targetsRefreshKey} />
          )}

          {activeTab === "runs" && <RunsTab />}

          {activeTab === "listings" && <ListingsTab />}
        </div>
      </div>

      {/* Create Target */}
      {formTarget !== null && (
        <ScraperTargetFormModal
          isOpen={true}
          onClose={() => setFormTarget(null)}
          target={formTarget?.id ? formTarget : null}
          onSuccess={() => {
            setFormTarget(null);
            setTargetsRefreshKey((key) => key + 1);
          }}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   Tab 1: Targets
   ═══════════════════════════════════════════ */
function TargetsTab({ refreshKey }) {
  const { targets, loading, meta, page, setPage, fetchTargets, toggleTarget } =
    useScraper();

  const [selected, setSelected] = useState([]);
  const [detailTarget, setDetailTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [triggerTarget, setTriggerTarget] = useState(null);

  useEffect(() => {
    fetchTargets({ page });
  }, [fetchTargets, page, refreshKey]);

  const handleRowAction = useCallback(
    (key, row) => {
      switch (key) {
        case "view":
          setDetailTarget(row);
          break;
        case "edit":
          setEditTarget(row);
          break;
        case "toggle_enabled":
        case "toggle_enabled_activate":
          toggleTarget(row.id, row.enabled);
          break;
        case "trigger_run":
          setTriggerTarget(row);
          break;
        default:
          break;
      }
    },
    [toggleTarget],
  );

  const handleBulkAction = useCallback(
    (key, rows) => {
      if (key === "toggle_enabled") {
        rows.forEach((r) => toggleTarget(r.id, r.enabled));
      }

      if (key === "trigger_run") {
        rows.forEach((r) => setTriggerTarget(r));
      }
    },
    [toggleTarget],
  );

  const pagination = useMemo(
    () => ({
      page,
      totalPages: Math.ceil((meta?.count || 0) / 20),
    }),
    [page, meta],
  );

  return (
    <>
      <ResourceTemplate
        columns={SCRAPER_TARGET_TABLE_COLUMNS}
        data={targets}
        loading={loading}
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

      {/* Target Detail */}
      {detailTarget && (
        <ScraperTargetDetailModal
          isOpen={!!detailTarget}
          onClose={() => setDetailTarget(null)}
          target={detailTarget}
        />
      )}

      {/* Edit Target */}
      {editTarget && (
        <ScraperTargetFormModal
          isOpen={true}
          onClose={() => setEditTarget(null)}
          target={editTarget}
          onSuccess={() => {
            setEditTarget(null);
            fetchTargets({ page });
          }}
        />
      )}

      {/* Trigger Scraper Run */}
      {triggerTarget && (
        <TriggerScraperRunModal
          isOpen={!!triggerTarget}
          onClose={() => setTriggerTarget(null)}
          target={triggerTarget}
          onSuccess={() => fetchTargets({ page })}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   Tab 2: Runs
   ═══════════════════════════════════════════ */
function RunsTab() {
  const { runs, loading, meta, page, setPage, fetchRuns, resumeRun } =
    useScraper();

  const [selected, setSelected] = useState([]);
  const [detailRun, setDetailRun] = useState(null);

  useEffect(() => {
    fetchRuns({ page });
  }, [fetchRuns, page]);

  const handleRowAction = useCallback(
    (key, row) => {
      switch (key) {
        case "view":
        case "view_items":
        case "view_errors":
          setDetailRun(row);
          break;
        case "resume":
          resumeRun(row.id).then(() => fetchRuns({ page }));
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
      totalPages: Math.ceil((meta?.count || 0) / 20),
    }),
    [page, meta],
  );

  const header = useMemo(
    () => (
      <div>
        <h2 className="text-lg font-bold">تاریخچه اجراها</h2>
        <p className="text-sm text-muted">
          {(meta?.count || 0).toLocaleString("fa-IR")} اجرا
        </p>
      </div>
    ),
    [meta],
  );

  return (
    <>
      <ResourceTemplate
        header={header}
        columns={SCRAPER_RUN_TABLE_COLUMNS}
        data={runs}
        loading={loading}
        selectable
        selected={selected}
        onSelectionChange={setSelected}
        rowActions={SCRAPER_RUN_ROW_ACTIONS}
        onRowAction={handleRowAction}
        pagination={pagination}
        onPageChange={setPage}
        emptyState={<EmptyState message="اجرایی ثبت نشده" />}
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

/* ═══════════════════════════════════════════
   Tab 3: Scraped Listings
   ═══════════════════════════════════════════ */
function ListingsTab() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
      <Inbox size={48} className="text-muted/40" />

      <div>
        <p className="text-sm font-medium text-foreground">
          آگهی‌های اسکرپ‌شده
        </p>

        <p className="text-xs text-muted mt-1 max-w-sm">
          آگهی‌های دریافتی از دیوار در صفحه «آگهی‌ها» قابل مشاهده و بررسی هستند.
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/admin/listings")}
      >
        مشاهده آگهی‌ها
      </Button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Shared
   ═══════════════════════════════════════════ */
function EmptyState({ message }) {
  return (
    <div className="py-12 text-center space-y-3">
      <Inbox size={48} className="mx-auto text-muted/40" />

      <p className="text-sm font-medium text-foreground">{message}</p>
    </div>
  );
}
