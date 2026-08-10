import { useState, useEffect } from "react";          // ← useEffect اضافه شد
import { GitCommit, List, AlertTriangle } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { INGESTION_RUN_STATUS_CONFIG, INGESTION_RUN_MODE_CONFIG } from "../config";
import { DetailFieldGrid, DetailListTable } from "@/shared/page/DetailContentRenderer";

const SCRAPER_RUN_TABS = [
  { key: "details", label: "جزئیات اجرا", icon: GitCommit },
  { key: "items", label: "آیتم‌ها", icon: List },
  { key: "errors", label: "خطاها", icon: AlertTriangle },
];

const SCRAPER_RUN_DETAIL_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "id", label: "شناسه اجرا", type: "mono" },
      { key: "target", label: "تارگت", type: "nested", nestedKey: "name", fullWidth: true },
      { key: "mode", label: "حالت", type: "status", configKey: "ingestionRunMode" },
      { key: "status", label: "وضعیت", type: "status", configKey: "ingestionRunStatus" },
    ],
  },
  {
    section: "counts",
    sectionLabel: "آمار",
    fields: [
      { key: "discovered_count", label: "کشف‌شده" },
      { key: "queued_count", label: "در صف" },
      { key: "processed_count", label: "پردازش‌شده" },
      { key: "new_count", label: "جدید" },
      { key: "changed_count", label: "تغییرکرده" },
      { key: "failed_count", label: "ناموفق" },
      { key: "removed_count", label: "حذف‌شده" },
    ],
  },
  {
    section: "dates",
    sectionLabel: "تاریخ‌ها",
    fields: [
      { key: "started_at", label: "زمان شروع", type: "dateTime" },
      { key: "finished_at", label: "زمان پایان", type: "dateTime" },
      { key: "created_at", label: "تاریخ ثبت", type: "dateTime" },
    ],
  },
  {
    section: "config",
    sectionLabel: "تنظیمات",
    fields: [
      { key: "configuration", label: "Configuration", type: "json", fullWidth: true },
    ],
  },
];

const SCRAPER_RUN_ITEM_COLUMNS = [
  { key: "external_id", header: "شناسه خارجی" },
  { key: "url", header: "URL", type: "link" },
  { key: "status", header: "وضعیت", type: "status", configKey: "ingestionRunItemStatus" },
  { key: "created_listing", header: "آگهی جدید", type: "boolean" },
  { key: "changed", header: "تغییرکرده", type: "boolean" },
  { key: "retry_count", header: "تلاش" },
];

export default function ScraperRunDetailModal({ isOpen, onClose, run }) {
  const [activeTab, setActiveTab] = useState("details");

  if (!run) return null;

  // ← useEffect به جای useMemo
  useEffect(() => {
    if (isOpen) setActiveTab("details");
  }, [isOpen, run?.id]);

  const errorItems = (run.items || []).filter((item) => item.status === "failed" || item.error);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="جزئیات اجرای اسکرپر" className="h-[85vh]">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center">
          <GitCommit className="w-5 h-5 text-sky-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground truncate">{run.target?.name || "اجرای اسکرپر"}</h3>
          <div className="flex items-center gap-2 mt-1">
            {/* ← INGESTION_RUN_MODE_CONFIG (همه حروف بزرگ) */}
            <StatusBadge status={run.mode} config={INGESTION_RUN_MODE_CONFIG} size="sm" variant="soft" />
            <StatusBadge status={run.status} config={INGESTION_RUN_STATUS_CONFIG} size="sm" variant="soft" />
            <span className="text-xs text-muted-foreground font-mono">{run.id?.slice(0, 8)}...</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline" className="flex-1 min-h-0 flex flex-col">
        <Tabs.List className="mb-2 shrink-0">
          {SCRAPER_RUN_TABS.map((tab) => (
            <Tabs.Trigger key={tab.key} value={tab.key} icon={tab.icon}>{tab.label}</Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <Tabs.Content value="details">
            <DetailFieldGrid data={run} sections={SCRAPER_RUN_DETAIL_FIELDS} />
          </Tabs.Content>

          <Tabs.Content value="items">
            <DetailListTable
              data={run.items || []}
              columns={SCRAPER_RUN_ITEM_COLUMNS}
              emptyText="آیتمی ثبت نشده"
            />
          </Tabs.Content>

          <Tabs.Content value="errors">
            <DetailListTable
              data={errorItems}
              columns={[
                ...SCRAPER_RUN_ITEM_COLUMNS.slice(0, 3),
                { key: "error", header: "پیام خطا", fullWidth: true },
              ]}
              emptyText="خطایی ثبت نشده"
            />
          </Tabs.Content>
        </div>
      </Tabs>

      {/* Footer */}
      <div className="shrink-0 flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>بستن</Button>
      </div>
    </Modal>
  );
}