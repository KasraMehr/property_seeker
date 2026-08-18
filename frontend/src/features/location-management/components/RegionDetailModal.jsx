import { useState, useMemo , useEffect} from "react";
import { MapPin, Home } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import {
  REGION_DETAIL_TABS,
  REGION_DETAIL_FIELDS,
  REGION_TABLE_COLUMNS,
} from "@/features/location-management/config";
import { DetailFieldGrid, DetailListTable } from "@/shared/page/DetailContentRenderer";

export default function RegionDetailModal({ isOpen, onClose, region }) {
  const [activeTab, setActiveTab] = useState("details");

  if (!region) return null;

  useEffect(() => {
    if (isOpen) setActiveTab("details");
  }, [isOpen, region?.id]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="جزئیات منطقه" className="h-[70vh]">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-violet-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground">{region.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {region.city?.name} / {region.city?.province?.name}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline" className="flex-1 min-h-0 flex flex-col">
        <Tabs.List className="mb-2 shrink-0">
          {REGION_DETAIL_TABS.map((tab) => (
            <Tabs.Trigger key={tab.key} value={tab.key} icon={tab.icon}>{tab.label}</Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <Tabs.Content value="details">
            <DetailFieldGrid data={region} sections={REGION_DETAIL_FIELDS} />
          </Tabs.Content>

          <Tabs.Content value="neighborhoods">
            <DetailListTable
              data={region.neighborhoods || []}
              columns={REGION_TABLE_COLUMNS}
              emptyText="محله‌ای ثبت نشده"
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