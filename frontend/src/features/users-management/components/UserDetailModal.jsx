import { useState, useMemo } from "react";
import {
  User,
  Phone,
  MapPin,
  Home,
  PhoneCall,
  ClipboardList,
  FileText,
  Eye,
  Inbox,
  Hash,
  Shield,
  Building2,
  CheckCircle2,
  XCircle,
  Crown,
  Calendar,
  StickyNote,
  Settings,
  UserPlus,
} from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import RoleBadge from "@/shared/ui/badges/RoleBadge";
import { formatDate, formatDateTime } from "@/utils/formatters";
import { getRoleConfig } from "@/constants/roleConfig";
import {
  USER_DETAIL_TABS,
  USER_PROFILE_FIELDS,
  USER_ICON_MAP,
  ACTIVITY_TYPE_CONFIG,
} from "@/features/users-management/config";

/* ─── Helpers ─── */
function getFieldValue(obj, field) {
  if (!obj) return null;
  const raw = obj[field.key];
  if (raw === null || raw === undefined || raw === "") return null;

  switch (field.type) {
    case "date":
      return formatDate(raw);
    case "phone":
      return raw;
    case "role": {
      const cfg = getRoleConfig(raw?.[0] || raw);
      return cfg;
    }
    case "nested":
      return raw?.[field.nestedKey] || "—";
    case "boolean":
      return raw ? "بله" : "خیر";
    default:
      return field.format ? field.format(raw) : String(raw);
  }
}

function FieldIcon({ fieldKey, className = "text-muted mt-0.5 shrink-0" }) {
  const Icon = USER_ICON_MAP[fieldKey] || StickyNote;
  return <Icon size={16} className={className} />;
}

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, label, value, colorClass }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border">
      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${colorClass.bg}`}>
        <Icon size={16} className={colorClass.text} />
      </div>
      <div>
        <p className="text-[10px] text-muted leading-none">{label}</p>
        <p className="text-sm font-bold text-foreground mt-0.5">
          {value?.toLocaleString("fa-IR") ?? "—"}
        </p>
      </div>
    </div>
  );
}

/* ─── Field Grid ─── */
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
                const isRole = field.type === "role" && value && typeof value === "object";

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
                        {isRole ? (
                          <RoleBadge role={data.role?.[0]} variant="soft" size="sm" />
                        ) : field.type === "boolean" ? (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                              value === "بله"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-rose-500/10 text-rose-500"
                            }`}
                          >
                            {value}
                          </span>
                        ) : field.type === "phone" ? (
                          <a href={`tel:${value}`} className="dir-ltr inline-block text-(--role-primary) hover:underline">
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

/* ─── Service Neighborhoods Grid ─── */
function NeighborhoodsGrid({ neighborhoods }) {
  if (!neighborhoods?.length) {
    return (
      <div className="py-8 text-center text-sm text-muted">
        منطقه خدمتی ثبت نشده است
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pr-1" dir="rtl">
      {neighborhoods.map((n) => (
        <div
          key={n.id}
          className="flex items-center gap-2 p-2.5 rounded-lg bg-surface border border-border"
        >
          <MapPin size={14} className="text-(--role-primary) shrink-0" />
          <span className="text-sm text-foreground">{n.name}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Activity Timeline ─── */
function ActivityTimeline({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <div className="py-12 text-center space-y-3">
        <Calendar size={48} className="mx-auto text-muted/40" />
        <p className="text-sm text-muted">فعالیتی ثبت نشده است</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pr-1" dir="rtl">
      {activities.map((item, idx) => {
        const cfg = ACTIVITY_TYPE_CONFIG[item.type] || ACTIVITY_TYPE_CONFIG.login;
        const Icon = cfg.icon;

        return (
          <div
            key={item.id || idx}
            className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border"
          >
            <div className={`w-9 h-9 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
              <Icon size={16} className={cfg.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{cfg.label}</p>
                <span className="text-[10px] text-muted whitespace-nowrap">
                  {formatDateTime(item.created_at)}
                </span>
              </div>
              {item.description && (
                <p className="text-xs text-muted mt-0.5">{item.description}</p>
              )}
              {item.target && (
                <p className="text-[10px] text-(--role-primary) mt-0.5">
                  {item.target}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Modal ─── */
export default function UserDetailModal({
  isOpen,
  onClose,
  user,
  stats = {},
  activities = [],
}) {
  const [activeTab, setActiveTab] = useState("profile");
  if (!user) return null;

  useMemo(() => {
    if (isOpen) setActiveTab("profile");
  }, [isOpen, user.id]);

  const roleCfg = getRoleConfig(user.role?.[0]);

  return (
    <Modal className="h-[85vh]" isOpen={isOpen} onClose={onClose} size="xl" title="جزئیات کاربر">
      {/* ═══ Header ═══ */}
      <div className="flex shrink-0 items-start gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-14 h-14 rounded-xl bg-(--role-subtle)/20 flex items-center justify-center text-(--role-primary) text-xl font-bold shrink-0">
          {user.full_name?.charAt(0) || "?"}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground">{user.full_name}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <RoleBadge role={user.role?.[0]} variant="soft" size="sm" />
            {user.is_owner && (
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500 font-medium">
                <Crown size={10} />
                مالک
              </span>
            )}
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                user.is_active
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-rose-500/10 text-rose-500"
              }`}
            >
              {user.is_active ? "فعال" : "غیرفعال"}
            </span>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            <StatCard
              icon={Home}
              label="املاک"
              value={stats.property_count}
              colorClass={{ bg: "bg-emerald-500/10", text: "text-emerald-500" }}
            />
            <StatCard
              icon={PhoneCall}
              label="تماس‌ها"
              value={stats.call_count}
              colorClass={{ bg: "bg-sky-500/10", text: "text-sky-500" }}
            />
            <StatCard
              icon={ClipboardList}
              label="پیگیری‌ها"
              value={stats.followup_count}
              colorClass={{ bg: "bg-amber-500/10", text: "text-amber-500" }}
            />
            <StatCard
              icon={FileText}
              label="آگهی‌ها"
              value={stats.listing_count}
              colorClass={{ bg: "bg-violet-500/10", text: "text-violet-500" }}
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
          {USER_DETAIL_TABS.map((tab) => (
            <Tabs.Trigger key={tab.key} value={tab.key} icon={tab.icon}>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {/* ── Tab 1: Profile ── */}
          <Tabs.Content value="profile">
            <div className="space-y-6">
              <FieldGrid
                data={user}
                sections={USER_PROFILE_FIELDS}
                emptyText="اطلاعات کاربر یافت نشد"
              />

              {/* Service Neighborhoods — separate section */}
              <div>
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 border-b border-border pb-1">
                  محله‌های خدمت
                </h4>
                <NeighborhoodsGrid neighborhoods={user.service_neighborhoods} />
              </div>
            </div>
          </Tabs.Content>

          {/* ── Tab 2: Activity ── */}
          <Tabs.Content value="activity">
            <ActivityTimeline activities={activities} />
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