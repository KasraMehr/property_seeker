import { useState, useMemo } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Home,
  User,
  Phone,
  Inbox,
  Hash,
  FileText,
  Tag,
  StickyNote,
  CalendarClock,
  Calendar,
  UserCheck,
  Building2,
  ClipboardList,
  UserCircle,
  ListTodo,
} from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { formatDateTime } from "@/utils/formatters";
import { FOLLOWUP_STATUS_CONFIG, FOLLOWUP_TYPE_CONFIG } from "@/features/followups/config";
import {
  FOLLOWUP_DETAIL_TABS,
  FOLLOWUP_TAB1_FIELDS,
  FOLLOWUP_TAB2_FIELDS,
  FOLLOWUP_ICON_MAP,
} from "@/features/followups/config";

/* ─── Helpers ─── */
function getFieldValue(obj, field) {
  if (!obj) return null;
  // dataKey برای مواقعی که چند فیلد از یک آبجکت nested می‌خوانیم
  const raw = obj[field.dataKey || field.key];
  if (raw === null || raw === undefined || raw === "") return null;

  switch (field.type) {
    case "date":
      return formatDateTime(raw, { time: false });
    case "dateTime":
      return formatDateTime(raw);
    case "phone":
      return raw;
    case "user":
      return typeof raw === "object" ? raw.full_name || raw.name || "—" : String(raw);
    case "nested":
      return raw?.[field.nestedKey] || "—";
    case "status": {
      const cfg = FOLLOWUP_STATUS_CONFIG[raw];
      return cfg || null;
    }
    case "followupType":
    case "type": {
      const cfg = FOLLOWUP_TYPE_CONFIG[raw];
      return cfg || null;
    }
    default:
      return field.format ? field.format(raw) : String(raw);
  }
}

function FieldIcon({ fieldKey, className = "text-muted mt-0.5 shrink-0" }) {
  const Icon = FOLLOWUP_ICON_MAP[fieldKey] || FileText;
  return <Icon size={16} className={className} />;
}

/* ─── Field Grid (enhanced with dataKey support) ─── */
function FieldGrid({ data, sections, emptyText = "اطلاعاتی موجود نیست" }) {
  if (!data) return <div className="py-12 text-center text-sm text-muted">{emptyText}</div>;

  return (
    <div className="space-y-6 pr-1" dir="rtl">
      {sections.map((section) => {
        const visible = section.fields.filter((f) => {
          const val = getFieldValue(data, f);
          return val !== null && val !== undefined && val !== "—";
        });
        if (visible.length === 0) return null;

        return (
          <div key={section.section}>
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 border-b border-border pb-1">
              {section.sectionLabel}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {visible.map((field) => {
                const value = getFieldValue(data, field);
                const isStatus = field.type === "status" && value && typeof value === "object";
                const isType = (field.type === "followupType" || field.type === "type") && value && typeof value === "object";

                return (
                  <div
                    key={field.key}
                    className={`flex items-start gap-2 p-2.5 rounded-lg bg-surface border border-border ${
                      field.fullWidth ? "sm:col-span-2" : ""
                    }`}
                  >
                    <FieldIcon fieldKey={field.key} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-muted uppercase tracking-wide">{field.label}</p>
                      <div className="text-sm text-foreground font-medium wrap-break-word">
                        {isStatus || isType ? (
                          <StatusBadge config={value} variant="soft" size="sm" />
                        ) : field.type === "phone" ? (
                          <a
                            href={`tel:${value}`}
                            className="dir-ltr inline-block text-(--role-primary) hover:underline"
                          >
                            {value}
                          </a>
                        ) : (
                          value
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

/* ─── Stat Pill ─── */
function StatPill({ icon: Icon, label, value, colorClass = "text-muted" }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border text-xs">
      <Icon size={13} className={colorClass} />
      <span className="text-muted">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

/* ─── Main Modal ─── */
export default function FollowupDetailModal({
  isOpen,
  onClose,
  followup,
  followupCount = 0,
}) {
  const [activeTab, setActiveTab] = useState("details");
  if (!followup) return null;

  useMemo(() => {
    if (isOpen) setActiveTab("details");
  }, [isOpen, followup.id]);

  const typeCfg = FOLLOWUP_TYPE_CONFIG[followup.type];
  const TypeIcon = typeCfg?.icon || Clock;

  return (
    <Modal className="h-[85vh]" isOpen={isOpen} onClose={onClose} size="xl" title="جزئیات پیگیری">
      {/* ═══ Header ═══ */}
      <div className="flex shrink-0 items-start gap-3 mb-4 pb-4 border-b border-border">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          typeCfg?.bg || "bg-muted/10"
        }`}>
          <TypeIcon size={22} className={typeCfg?.text || "text-muted"} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground leading-tight">
            {followup.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Status */}
            {FOLLOWUP_STATUS_CONFIG[followup.status] && (
              <StatusBadge
                config={FOLLOWUP_STATUS_CONFIG[followup.status]}
                variant="soft"
                size="sm"
              />
            )}
            {/* Type */}
            {typeCfg && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${typeCfg.bg} ${typeCfg.text}`}>
                <TypeIcon size={10} />
                {typeCfg.label}
              </span>
            )}
            {/* ID */}
            <span className="text-xs font-mono text-muted dir-ltr">#{followup.id}</span>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {followup.property && (
              <StatPill
                icon={Home}
                label="ملک"
                value={followup.property.title}
                colorClass="text-(--role-primary)"
              />
            )}
            {followup.customer?.phone && (
              <StatPill
                icon={Phone}
                label="تماس"
                value={followup.customer.phone}
                colorClass="text-emerald-500"
              />
            )}
            <StatPill
              icon={ListTodo}
              label="تعداد پیگیری‌ها"
              value={followupCount.toLocaleString("fa-IR")}
              colorClass="text-sky-500"
            />
          </div>
        </div>
      </div>

      {/* ═══ Tabs ═══ */}
      <Tabs
        className="flex-1 min-h-0 flex flex-col"
        value={activeTab}
        onValueChange={setActiveTab}
        variant="underline"
      >
        <Tabs.List className="mb-2 shrink-0">
          {FOLLOWUP_DETAIL_TABS.map((tab) => (
            <Tabs.Trigger key={tab.key} value={tab.key} icon={tab.icon}>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {/* ── Tab 1: Details ── */}
          <Tabs.Content value="details">
            <FieldGrid
              data={followup}
              sections={FOLLOWUP_TAB1_FIELDS}
              emptyText="اطلاعات پیگیری یافت نشد"
            />
          </Tabs.Content>

          {/* ── Tab 2: Customer & Contact ── */}
          <Tabs.Content value="customer">
            <FieldGrid
              data={followup}
              sections={FOLLOWUP_TAB2_FIELDS}
              emptyText="اطلاعات مشتری یافت نشد"
            />
          </Tabs.Content>
        </div>
      </Tabs>

      {/* ═══ Footer ═══ */}
      <div className="shrink-0 flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>
          بستن
        </Button>
      </div>
    </Modal>
  );
}