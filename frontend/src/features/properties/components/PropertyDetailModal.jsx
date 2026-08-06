import { useState, useMemo } from "react";
import {
  ExternalLink,
  Home,
  User,
  Phone,
  Calendar,
  Clock,
  Inbox,
  FileText,
  MapPin,
  Users,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Voicemail,
} from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import Thumbnail from "@/shared/ui/Thumbnail";
import { formatPrice, formatDate, formatDateTime } from "@/utils/formatters";
import { buildStatusConfig } from "@/constants/status.utils";
import { PROPERTY_STATUS_CONFIG } from "@/features/properties/config";
import {
  PROPERTY_DETAIL_TABS,
  PROPERTY_DETAIL_FIELDS,
  OWNER_DETAIL_FIELDS,
  PROPERTY_ICON_MAP,
  CALL_TYPE_CONFIG,
  CALL_STATUS_CONFIG,
  FOLLOWUP_TYPE_CONFIG,
  FOLLOWUP_STATUS_CONFIG,
} from "@/features/properties/config";

/* ─── Helpers ─── */
function getFieldValue(obj, field) {
  if (!obj) return null;
  const raw = obj[field.key];
  if (raw === null || raw === undefined || raw === "") return null;

  switch (field.type) {
    case "price":
      return formatPrice(raw);
    case "date":
      return formatDate(raw);
    case "phone":
      return raw;
    case "user":
      return typeof raw === "object" ? raw.full_name || raw.name || "—" : String(raw);
    case "nested":
      return raw?.[field.nestedKey] || "—";
    case "status": {
      const config = buildStatusConfig(PROPERTY_STATUS_CONFIG, raw);
      return config;
    }
    default:
      return String(raw);
  }
}

function FieldIcon({ fieldKey, className = "text-muted mt-0.5 shrink-0" }) {
  const Icon = PROPERTY_ICON_MAP[fieldKey] || FileText;
  return <Icon size={16} className={className} />;
}

/* ─── Field Grid (same pattern as ListingDetailModal) ─── */
function FieldGrid({ data, sections, emptyText = "اطلاعاتی موجود نیست" }) {
  if (!data) {
    return <div className="py-12 text-center text-sm text-muted">{emptyText}</div>;
  }

  return (
    <div className="space-y-6 pr-1" dir="rtl">
      {sections.map((section) => {
        const visibleFields = section.fields.filter((f) => {
          const val = getFieldValue(data, f);
          return val !== null && val !== undefined && val !== "—";
        });
        if (visibleFields.length === 0) return null;

        return (
          <div key={section.section}>
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 border-b border-border pb-1">
              {section.sectionLabel}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {visibleFields.map((field) => {
                const value = getFieldValue(data, field);
                const isStatus = field.type === "status" && typeof value === "object";

                return (
                  <div
                    key={field.key}
                    className={`flex items-start gap-2 p-2.5 rounded-lg bg-surface border border-border ${
                      field.fullWidth ? "sm:col-span-2" : ""
                    }`}
                  >
                    <FieldIcon fieldKey={field.key} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-muted uppercase tracking-wide">
                        {field.label}
                      </p>
                      <div className="text-sm text-foreground font-medium wrap-break-word">
                        {isStatus ? (
                          <StatusBadge config={value} variant="soft" size="sm" />
                        ) : (
                          <>
                            {value}
                            {field.suffix || ""}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Call History List ─── */
function CallHistoryList({ calls = [] }) {
  if (calls.length === 0) {
    return (
      <div className="py-12 text-center space-y-3">
        <PhoneOutgoing size={48} className="mx-auto text-muted/40" />
        <p className="text-sm text-muted">تماسی ثبت نشده است</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pr-1" dir="rtl">
      {calls.map((call, idx) => {
        const typeCfg = CALL_TYPE_CONFIG[call.call_type] || CALL_TYPE_CONFIG.outgoing;
        const statusCfg = CALL_STATUS_CONFIG[call.status] || CALL_STATUS_CONFIG.completed;
        const TypeIcon = typeCfg.icon;

        return (
          <div
            key={call.id || idx}
            className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border"
          >
            <div className={`w-9 h-9 rounded-lg ${typeCfg.bg} flex items-center justify-center shrink-0`}>
              <TypeIcon size={16} className={typeCfg.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {typeCfg.label}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${statusCfg.bg} ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                </div>
                <span className="text-[10px] text-muted whitespace-nowrap">
                  {formatDateTime(call.created_at)}
                </span>
              </div>
              {call.notes && (
                <p className="text-xs text-muted mt-1">{call.notes}</p>
              )}
              <p className="text-[10px] text-muted mt-1">
                توسط: {call.created_by?.full_name || "—"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Followup History List ─── */
function FollowupHistoryList({ followups = [] }) {
  if (followups.length === 0) {
    return (
      <div className="py-12 text-center space-y-3">
        <Clock size={48} className="mx-auto text-muted/40" />
        <p className="text-sm text-muted">پیگیری ثبت نشده است</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pr-1" dir="rtl">
      {followups.map((item, idx) => {
        const typeCfg = FOLLOWUP_TYPE_CONFIG[item.followup_type] || FOLLOWUP_TYPE_CONFIG.call;
        const statusCfg = FOLLOWUP_STATUS_CONFIG[item.status] || FOLLOWUP_STATUS_CONFIG.pending;
        const TypeIcon = typeCfg.icon;

        return (
          <div
            key={item.id || idx}
            className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border"
          >
            <div className={`w-9 h-9 rounded-lg ${typeCfg.bg} flex items-center justify-center shrink-0`}>
              <TypeIcon size={16} className={typeCfg.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {typeCfg.label}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${statusCfg.bg} ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                </div>
                <span className="text-[10px] text-muted whitespace-nowrap">
                  {item.due_date ? formatDate(item.due_date) : formatDate(item.created_at)}
                </span>
              </div>
              {item.notes && (
                <p className="text-xs text-muted mt-1">{item.notes}</p>
              )}
              <p className="text-[10px] text-muted mt-1">
                توسط: {item.created_by?.full_name || "—"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Modal ─── */
export default function PropertyDetailModal({
  isOpen,
  onClose,
  property,
  calls = [],
  followups = [],
  sourceListing = null,
  onViewSourceListing,
  onRegisterFollowup,
}) {
  const [activeTab, setActiveTab] = useState("property");

  if (!property) return null;

  // Reset tab on open
  useMemo(() => {
    if (isOpen) setActiveTab("property");
  }, [isOpen, property.id]);

  return (
    <Modal
      className="h-[85vh]"
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="جزئیات ملک"
    >
      {/* 1. Header: Thumbnail + Info + Source Link */}
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <Thumbnail
          src={property.hs_picture}
          alt={property.title}
          size="lg"
          fallbackIcon={Home}
          className="rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground truncate">
            {property.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs font-mono text-muted dir-ltr">
              {property.property_code}
            </span>
            {property.deal_type && (
              <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium bg-(--role-subtle)/20 text-(--role-primary)">
                {property.deal_type === "sale" ? "فروش" : property.deal_type === "rent" ? "اجاره" : "رهن"}
              </span>
            )}
            <StatusBadge
              config={buildStatusConfig(PROPERTY_STATUS_CONFIG, property.status)}
              variant="soft"
              size="sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {sourceListing && onViewSourceListing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewSourceListing(sourceListing)}
            >
              <ExternalLink size={14} className="ml-1" />
              آگهی مبدا
            </Button>
          )}
        </div>
      </div>

      {/* 2. Tabs */}
      <Tabs
        className="flex-1 min-h-0 flex flex-col"
        value={activeTab}
        onValueChange={setActiveTab}
        variant="underline"
      >
        <Tabs.List className="mb-2 shrink-0">
          {PROPERTY_DETAIL_TABS.map((tab) => (
            <Tabs.Trigger key={tab.key} value={tab.key} icon={tab.icon}>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {/* Tab 1: Property */}
          <Tabs.Content value="property">
            <FieldGrid
              data={property}
              sections={PROPERTY_DETAIL_FIELDS}
              emptyText="اطلاعات ملک یافت نشد"
            />
          </Tabs.Content>

          {/* Tab 2: Owner */}
          <Tabs.Content value="owner">
            <FieldGrid
              data={property.owner}
              sections={OWNER_DETAIL_FIELDS}
              emptyText="مالکی ثبت نشده است"
            />
          </Tabs.Content>

          {/* Tab 3: Call History */}
          <Tabs.Content value="calls">
            <CallHistoryList calls={calls} />
          </Tabs.Content>

          {/* Tab 4: Followup History */}
          <Tabs.Content value="followups">
            <FollowupHistoryList followups={followups} />
          </Tabs.Content>
        </div>
      </Tabs>

      {/* 3. Footer: Close + Register Followup */}
      <div className="shrink-0 flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>
          بستن
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onRegisterFollowup?.(property)}
        >
          <Calendar size={14} className="ml-1" />
          ثبت پیگیری
        </Button>
      </div>
    </Modal>
  );
}