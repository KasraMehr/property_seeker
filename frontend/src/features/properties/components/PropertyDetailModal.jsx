import { useState, useMemo, useEffect, useCallback } from "react";
import { Home, Phone } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import useAuth from "@/features/auth/hooks/useAuth";
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
import propertyService from "@/features/properties/services/propertyService";

export default function PropertyDetailModal({
  isOpen,
  onClose,
  property,
  loading = false,
  onRegisterCall,
  onEdit,
}) {
  const [activeTab, setActiveTab] = useState("details");
  const [statusHistory, setStatusHistory] = useState([]);
  const [features, setFeatures] = useState([]);
  const [media, setMedia] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);

  const availableTabs = useMemo(() => {
    return (PROPERTY_DETAIL_TABS || []).filter(() => true);
  }, []);

  const fetchTabData = useCallback(async () => {
    if (!property?.id) return;
    setTabLoading(true);
    try {
      if (activeTab === "status_history") {
        const data = await propertyService.getStatusHistory(property.id, property.property_code);
        setStatusHistory(data);
      } else if (activeTab === "features") {
        const data = await propertyService.getFeatures(property.id, property.property_code);
        setFeatures(data);
      } else if (activeTab === "media") {
        const data = await propertyService.getMedia(property.id);
        setMedia(data);
      }
    } catch (e) {
      console.error("Tab data fetch error:", e);
    } finally {
      setTabLoading(false);
    }
  }, [property?.id, property?.property_code, activeTab]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("details");
      setStatusHistory([]);
    }
  }, [isOpen, property?.id]);

  useEffect(() => {
    if (property?.id) fetchTabData();
  }, [activeTab, property?.id, fetchTabData]);

  const { user } = useAuth();
  const isAdmin = Boolean(user?.is_owner);

  /* ─── Filter fields for non-owners ─── */
  const detailFields = useMemo(() => {
    if (isAdmin) return PROPERTY_DETAIL_FIELDS;
    return PROPERTY_DETAIL_FIELDS.map((section) => ({
      ...section,
      fields: section.fields.filter((f) => f.key !== "agent"),
    })).filter((section) => section.fields.length > 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

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
            <DetailFieldGrid data={property} sections={detailFields} />
          </Tabs.Content>

          <Tabs.Content value="status_history">
            <DetailListTable
              data={statusHistory}
              columns={PROPERTY_STATUS_HISTORY_COLUMNS}
              loading={tabLoading}
              emptyText="تاریخچه‌ای ثبت نشده است"
            />
          </Tabs.Content>
          {/* change_history tab removed — API pending */}
          <Tabs.Content value="features">
            <DetailListTable
              data={features}
              columns={PROPERTY_FEATURE_COLUMNS}
              loading={tabLoading}
              emptyText="امکاناتی ثبت نشده است"
            />
          </Tabs.Content>
          <Tabs.Content value="media">
            <DetailListTable
              data={media}
              columns={PROPERTY_MEDIA_COLUMNS}
              loading={tabLoading}
              emptyText=" (به زودی) رسانه‌ای بارگذاری نشده است"
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