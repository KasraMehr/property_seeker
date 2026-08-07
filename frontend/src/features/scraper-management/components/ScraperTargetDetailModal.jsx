import { useState, useMemo } from "react";
import { Target, GitCommit, Globe, Play, Pause } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { SCRAPE_TARGET_STATUS_CONFIG } from "@/constants/scrapeTargetStatus.config";
import {
  SCRAPER_TARGET_DETAIL_TABS,
  SCRAPER_TARGET_DETAIL_FIELDS,
  SCRAPER_TARGET_RUN_COLUMNS,
  SCRAPER_TARGET_LISTING_COLUMNS,
} from "@/features/scraper-management/config";
import { DetailFieldGrid, DetailListTable } from "@/shared/page/DetailContentRenderer";

export default function ScraperTargetDetailModal({ isOpen, onClose, target }) {
  const [activeTab, setActiveTab] = useState("details");

  if (!target) return null;

  useMemo(() => {
    if (isOpen) setActiveTab("details");
  }, [isOpen, target?.id]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="جزئیات تارگت اسکرپر" className="h-[85vh]">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${target.enabled ? "bg-emerald-500/10" : "bg-muted"}`}>
          {target.enabled ? <Play className="w-5 h-5 text-emerald-500" /> : <Pause className="w-5 h-5 text-muted-foreground" />}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground truncate">{target.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={target.enabled ? "enabled" : "disabled"} config={SCRAPE_TARGET_STATUS_CONFIG} size="sm" variant="soft" />
            <span className="text-xs text-muted-foreground">{target.source?.name}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline" className="flex-1 min-h-0 flex flex-col">
        <Tabs.List className="mb-2 shrink-0">
          {SCRAPER_TARGET_DETAIL_TABS.map((tab) => (
            <Tabs.Trigger key={tab.key} value={tab.key} icon={tab.icon}>{tab.label}</Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <Tabs.Content value="details">
            <DetailFieldGrid data={target} sections={SCRAPER_TARGET_DETAIL_FIELDS} />
          </Tabs.Content>

          <Tabs.Content value="runs">
            <DetailListTable
              data={target.runs || []}
              columns={SCRAPER_TARGET_RUN_COLUMNS}
              emptyText="اجرایی ثبت نشده"
            />
          </Tabs.Content>

          <Tabs.Content value="listings">
            <DetailListTable
              data={target.target_listings || []}
              columns={SCRAPER_TARGET_LISTING_COLUMNS}
              emptyText="آگهی‌ای کشف نشده"
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