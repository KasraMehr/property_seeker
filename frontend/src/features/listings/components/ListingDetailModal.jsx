import { useState, useMemo } from "react";
import {
  ExternalLink,
  Home,
  User,
  Clock,
  FileText,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Image,
  Hash,
  Building,
  Car,
  Warehouse,
  Compass,
  Wrench,
  CheckCircle,
  XCircle,
  ArrowRightLeft,
  UserPlus,
  MessageSquare,
  StickyNote,
  Briefcase,
  Inbox,
} from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import ScoreBadge from "@/shared/ui/badges/ScoreBadge";
import SourceBadge from "@/shared/ui/badges/SourceBadge";
import Thumbnail from "@/shared/ui/Thumbnail";
import { formatPrice, formatDate, fmtSource } from "@/utils/formatters";
import { buildStatusConfig } from "@/constants/status.utils";
import { LISTING_STATUS_CONFIG } from "@/features/listings/config";
import {
  LISTING_DETAIL_TABS,
  LISTING_DETAIL_FIELDS,
  PROPERTY_DETAIL_FIELDS,
  OWNER_DETAIL_FIELDS,
  HISTORY_TYPES,
  DETAIL_ICON_MAP,
} from "@/features/listings/config";

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
      return typeof raw === "object"
        ? raw.full_name || raw.name || "—"
        : String(raw);
    case "nested":
      return raw?.[field.nestedKey] || "—";
    case "status": {
      const config = buildStatusConfig(LISTING_STATUS_CONFIG, raw);
      return config;
    }
    case "score":
      return raw;
    case "source":
      return typeof raw === "string" ? raw : raw?.name || raw;
    default:
      return String(raw);
  }
}

function FieldIcon({ fieldKey, className = "text-muted mt-0.5 shrink-0" }) {
  const Icon = DETAIL_ICON_MAP[fieldKey] || FileText;
  return <Icon size={16} className={className} />;
}

/* ─── Tab Content: Field Grid ─── */
function FieldGrid({ data, sections, emptyText = "اطلاعاتی موجود نیست" }) {
  if (!data) {
    return (
      <div className="py-12 text-center text-sm text-muted">{emptyText}</div>
    );
  }

  return (
    <div className="space-y-6  pr-1" dir="rtl">
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
                const isStatus =
                  field.type === "status" && typeof value === "object";

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
                          <StatusBadge
                            config={value}
                            variant="soft"
                            size="sm"
                          />
                        ) : field.type === "score" ? (
                          <ScoreBadge
                            score={value}
                            size="sm"
                            showLabel={false}
                          />
                        ) : field.type === "source" ? (
                          <SourceBadge source={value} size="sm" />
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

/* ─── Tab Content: Activity History ─── */
function HistoryList({ listing }) {
  // Mock history data — replace with real API data
  const history = useMemo(() => {
    const items = [];

    if (listing.created_at) {
      items.push({
        type: "CONVERSION",
        title: "آگهی ثبت شد",
        description: `توسط ${listing.created_by?.full_name || "سیستم"}`,
        date: listing.created_at,
      });
    }

    if (listing.assigned_to) {
      items.push({
        type: "ASSIGNMENT",
        title: "تخصیص به کارشناس",
        description: `اختصاص یافته به ${listing.assigned_to.full_name}`,
        date: listing.updated_at,
      });
    }

    if (listing.call_count > 0) {
      items.push({
        type: "CALL",
        title: `${listing.call_count} تماس ثبت شده`,
        description: listing.last_call_at
          ? `آخرین تماس: ${formatDate(listing.last_call_at)}`
          : "اطلاعات تماس موجود نیست",
        date: listing.last_call_at || listing.updated_at,
      });
    }

    if (listing.converted_to) {
      items.push({
        type: "CONVERSION",
        title: `تبدیل به ${listing.converted_to === "property" ? "ملک" : "مالک"}`,
        description: `شناسه تبدیل: ${listing.converted_id || "—"}`,
        date: listing.updated_at,
      });
    }

    // Sort by date desc
    return items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [listing]);

  if (history.length === 0) {
    return (
      <div className="py-12 text-center space-y-3">
        <Inbox size={48} className="mx-auto text-muted/40" />
        <p className="text-sm text-muted">تاریخچه فعالیتی ثبت نشده است</p>
      </div>
    );
  }

  return (
    <div className="space-y-3  pr-1" dir="rtl">
      {history.map((item, idx) => {
        const config = HISTORY_TYPES[item.type] || HISTORY_TYPES.NOTE;
        const Icon = config.icon;

        return (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border"
          >
            <div
              className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}
            >
              <Icon size={16} className={config.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <span className="text-[10px] text-muted whitespace-nowrap">
                  {formatDate(item.date)}
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Modal ─── */
export default function ListingDetailModal({ isOpen, onClose, listing }) {
  const [activeTab, setActiveTab] = useState("listing");

  if (!listing) return null;

  const hasProperty = !!listing.property;
  const hasOwner =
    !!listing.property?.owner ||
    (listing.converted_to === "owner" && listing.converted_id);

  // Determine available tabs
  const availableTabs = useMemo(() => {
    return LISTING_DETAIL_TABS.filter((tab) => {
      if (tab.key === "property") return hasProperty;
      if (tab.key === "owner") return hasOwner;
      return true;
    });
  }, [hasProperty, hasOwner]);

  // Reset to listing tab when modal opens with new data
  useMemo(() => {
    if (isOpen) setActiveTab("listing");
  }, [isOpen, listing.id]);

  return (
    <Modal
      className="h-[85vh]"
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="جزئیات آگهی"
    >
      {/* 1. Thumbnail + Quick Info Header (ثابت) */}
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <Thumbnail
          src={listing.hs_picture}
          alt={listing.title}
          size="lg"
          className="rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground truncate">
            {listing.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <SourceBadge
              source={
                typeof listing.source === "string"
                  ? listing.source
                  : listing.source?.name
              }
              size="sm"
            />
            <StatusBadge
              config={buildStatusConfig(LISTING_STATUS_CONFIG, listing.status)}
              variant="soft"
              size="sm"
            />
            {listing.score != null && (
              <ScoreBadge score={listing.score} size="sm" showLabel={false} />
            )}
          </div>
        </div>
        {listing.url && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(listing.url, "_blank")}
          >
            <ExternalLink size={14} className="ml-1" />
            منبع
          </Button>
        )}
      </div>

      {/* 2. Tabs Container (تنظیم Flex برای کنترل ارتفاع) */}
      <Tabs
        className="flex-1 min-h-0 flex flex-col"
        value={activeTab}
        onValueChange={setActiveTab}
        variant="underline"
      >
        {/* Header تب‌ها (ثابت) */}
        <Tabs.List className="mb-2 shrink-0">
          {availableTabs.map((tab) => (
            <Tabs.Trigger key={tab.key} value={tab.key} icon={tab.icon}>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* محتوای تب‌ها (فقط این بخش اسکرول می‌شود) */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {/* Tab 1: Listing Details */}
          <Tabs.Content value="listing">
            <FieldGrid
              data={listing}
              sections={LISTING_DETAIL_FIELDS}
              emptyText="اطلاعات آگهی یافت نشد"
            />
          </Tabs.Content>

          {/* Tab 2: Property Details */}
          <Tabs.Content value="property">
            <FieldGrid
              data={listing.property}
              sections={PROPERTY_DETAIL_FIELDS}
              emptyText="این آگهی هنوز به ملک تبدیل نشده است"
            />
          </Tabs.Content>

          {/* Tab 3: Owner Details */}
          <Tabs.Content value="owner">
            <FieldGrid
              data={listing.property?.owner || listing.owner_data}
              sections={OWNER_DETAIL_FIELDS}
              emptyText="مالکی ثبت نشده است"
            />
          </Tabs.Content>

          {/* Tab 4: Activity History */}
          <Tabs.Content value="history">
            <HistoryList listing={listing} />
          </Tabs.Content>
        </div>
      </Tabs>

      {/* 3. Footer (ثابت) */}
      <div className="shrink-0 flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>
          بستن
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onRegisterCall?.(listing)}
        >
          <Phone size={14} className="ml-1" />
          ثبت تماس
        </Button>
      </div>
    </Modal>
  );
}
