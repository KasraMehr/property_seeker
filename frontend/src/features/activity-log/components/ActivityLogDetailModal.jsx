import { useState, useMemo } from "react";
import { Activity, Code, FileText } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import Can from "@/shared/access/Can";
import { PERMISSIONS } from "@/constants/permissions";
import {
  ACTIVITY_LOG_DETAIL_TABS,
  ACTIVITY_LOG_DETAIL_FIELDS,
  ACTIVITY_LOG_REQUEST_FIELDS,
  ACTIVITY_LOG_DATA_DIFF_FIELDS,
} from "@/features/activity-log/config";
import { DetailFieldGrid } from "@/shared/components/DetailContentRenderer";

export default function ActivityLogDetailModal({ isOpen, onClose, log }) {
  const [activeTab, setActiveTab] = useState("details");

  if (!log) return null;

  useMemo(() => {
    if (isOpen) setActiveTab("details");
  }, [isOpen, log?.id]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="جزئیات لاگ" className="h-[85vh]">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center">
          <Activity className="w-5 h-5 text-slate-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground">{log.action || "لاگ سیستم"}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">Request ID: {log.request_id || "—"}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline" className="flex-1 min-h-0 flex flex-col">
        <Tabs.List className="mb-2 shrink-0">
          {ACTIVITY_LOG_DETAIL_TABS.map((tab) => (
            <Can key={tab.key} permission={tab.permission}>
              <Tabs.Trigger value={tab.key} icon={tab.icon}>{tab.label}</Tabs.Trigger>
            </Can>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <Tabs.Content value="details">
            <DetailFieldGrid data={log} sections={ACTIVITY_LOG_DETAIL_FIELDS} />
          </Tabs.Content>

          <Tabs.Content value="request">
            <DetailFieldGrid data={log} sections={ACTIVITY_LOG_REQUEST_FIELDS} />
          </Tabs.Content>

          <Tabs.Content value="data_diff">
            <DetailFieldGrid data={log} sections={ACTIVITY_LOG_DATA_DIFF_FIELDS} />
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