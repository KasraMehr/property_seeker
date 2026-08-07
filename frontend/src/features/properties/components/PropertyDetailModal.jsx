import { useState, useMemo } from "react";
import { Home, Clock, History, Star, Image, Phone } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { PROPERTY_STATUS_CONFIG, PROPERTY_DEAL_TYPE_CONFIG } from "@/constants";
import {
  PROPERTY_DETAIL_TABS,
  PROPERTY_DETAIL_FIELDS,
  PROPERTY_STATUS_HISTORY_COLUMNS,
  PROPERTY_CHANGE_HISTORY_COLUMNS,
  PROPERTY_FEATURE_COLUMNS,
  PROPERTY_MEDIA_COLUMNS,
} from "@/features/properties/config";
import { DetailFieldGrid, DetailListTable } from "@/shared/components/DetailContentRenderer";
import Can from "@/shared/access/Can";
import { PERMISSIONS } from "@/constants/permissions";

export default function PropertyDetailModal({ isOpen, onClose, property, onRegisterCall }) {
  const [activeTab, setActiveTab] = useState("details");

  if (!property) return null;

  const availableTabs = useMemo(() => {
    return PROPERTY_DETAIL_TABS.filter((tab) => {
      if (tab.permission) return true; // Can component handles visibility
      return true;
    });
  }, []);

  useMemo(() => {
    if (isOpen) setActiveTab("details");
  }, [isOpen, property?.id]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="جزئیات ملک" className="h-[85vh]">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Home className="w-6 h-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground truncate">{property.title}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs font-mono text-primary">{property.property_code}</span>
            <StatusBadge status={property.deal_type} config={PROPERTY_DEAL_TYPE_CONFIG} size="sm" variant="soft" />
            <StatusBadge status={property.status} config={PROPERTY_STATUS_CONFIG} size="sm" variant="soft" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline" className="flex-1 min-h-0 flex flex-col">
        <Tabs.List className="mb-2 shrink-0">
          {availableTabs.map((tab) => (
            <Can key={tab.key} permission={tab.permission}>
              <Tabs.Trigger value={tab.key} icon={tab.icon}>{tab.label}</Tabs.Trigger>
            </Can>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <Tabs.Content value="details">
            <DetailFieldGrid data={property} sections={PROPERTY_DETAIL_FIELDS} />
          </Tabs.Content>

          <Tabs.Content value="status_history">
            <DetailListTable
              data={property.status_history || []}
              columns={PROPERTY_STATUS_HISTORY_COLUMNS}
              emptyText="تاریخچه وضعیت خالی است"
            />
          </Tabs.Content>

          <Tabs.Content value="change_history">
            <DetailListTable
              data={property.change_history || []}
              columns={PROPERTY_CHANGE_HISTORY_COLUMNS}
              emptyText="تاریخچه تغییرات خالی است"
            />
          </Tabs.Content>

          <Tabs.Content value="features">
            <DetailListTable
              data={property.features || []}
              columns={PROPERTY_FEATURE_COLUMNS}
              emptyText="امکاناتی ثبت نشده"
            />
          </Tabs.Content>

          <Tabs.Content value="media">
            <DetailListTable
              data={property.media || []}
              columns={PROPERTY_MEDIA_COLUMNS}
              emptyText="رسانه‌ای آپلود نشده"
            />
          </Tabs.Content>
        </div>
      </Tabs>

      {/* Footer */}
      <div className="shrink-0 flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>بستن</Button>
        <Button variant="primary" size="sm" onClick={() => onRegisterCall?.(property)}>
          <Phone size={14} className="ml-1" />
          ثبت تماس
        </Button>
      </div>
    </Modal>
  );
}