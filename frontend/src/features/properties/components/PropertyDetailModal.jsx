import { useState, useMemo, useEffect } from "react";
import { Home, Phone } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import {
  PROPERTY_STATUS_CONFIG,
  PROPERTY_DEAL_TYPE_CONFIG,
  PROPERTY_DETAIL_TABS,
  PROPERTY_DETAIL_FIELDS,
  PROPERTY_STATUS_HISTORY_COLUMNS,
  PROPERTY_CHANGE_HISTORY_COLUMNS,
  PROPERTY_FEATURE_COLUMNS,
  PROPERTY_MEDIA_COLUMNS,
} from "@/features/properties/config";
import { buildStatusConfig } from "@/constants/status.utils";
import { DetailFieldGrid, DetailListTable } from "@/shared/page/DetailContentRenderer";

export default function PropertyDetailModal({
  isOpen,
  onClose,
  property,
  loading = false,
  onRegisterCall,
  onEdit,
}) {
  const [activeTab, setActiveTab] = useState("details");

  const availableTabs = useMemo(() => {
    return (PROPERTY_DETAIL_TABS || []).filter(() => true);
  }, []);

  useEffect(() => {
    if (isOpen) setActiveTab("details");
  }, [isOpen, property?.id]);

  if (!isOpen || !property) return null;

  const dealCfg = PROPERTY_DEAL_TYPE_CONFIG?.[property.deal_type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="جزئیات ملک"
      className="h-[85vh]"
    >
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Home className="w-6 h-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground truncate">
            {property.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs font-mono text-primary">
              {property.property_code}
            </span>
            {dealCfg && (
              <span className="text-xs text-muted">{dealCfg.label}</span>
            )}
            <StatusBadge
              config={buildStatusConfig(PROPERTY_STATUS_CONFIG, property.status)}
              size="sm"
              variant="soft"
            />
          </div>
        </div>
      </div>

      {loading && (
        <p className="text-xs text-muted mb-2">در حال بارگذاری جزئیات...</p>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        variant="underline"
        className="flex-1 min-h-0 flex flex-col"
      >
        <Tabs.List className="mb-2 shrink-0">
          {availableTabs.map((tab) => (
            <Tabs.Trigger key={tab.key} value={tab.key}>
              {tab.label}
            </Tabs.Trigger>
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
              emptyText="مشاهده ی تاریخچه وضعیت (به زودی)"
            />
          </Tabs.Content>
          <Tabs.Content value="history">
            <DetailListTable
              data={property.change_history || property.history || []}
              columns={PROPERTY_CHANGE_HISTORY_COLUMNS}
              emptyText="مشاهده ی تاریخچه تغییرات (به زودی)"
            />
          </Tabs.Content>
          <Tabs.Content value="features">
            <DetailListTable
              data={property.features || []}
              columns={PROPERTY_FEATURE_COLUMNS}
              emptyText="مشاهده ی ویژگی های خاص ملک (به زودی)"
            />
          </Tabs.Content>
          <Tabs.Content value="media">
            <DetailListTable
              data={property.media || []}
              columns={PROPERTY_MEDIA_COLUMNS}
              emptyText="مشاهده ی رسانه های بارگذاری شده (به زودی)"
            />
          </Tabs.Content>
        </div>
      </Tabs>

      <div className="shrink-0 flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>
          بستن
        </Button>
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(property)}>
            ویرایش
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={() => onRegisterCall?.(property)}
        >
          <Phone size={14} className="ml-1" />
          ثبت تماس
        </Button>
      </div>
    </Modal>
  );
}