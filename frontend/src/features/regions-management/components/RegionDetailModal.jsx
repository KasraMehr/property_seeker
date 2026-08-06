import { useState, useMemo } from "react";
import {
  MapPin,
  Home,
  Building2,
  Users,
  FileText,
  PhoneCall,
  ClipboardList,
  BarChart3,
  TrendingUp,
  UserCheck,
  Inbox,
  Hash,
  Calendar,
  Phone,
} from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import RoleBadge from "@/shared/ui/badges/RoleBadge";
import { formatDate } from "@/utils/formatters";
import {
  REGION_DETAIL_TABS,
  REGION_DETAIL_FIELDS,
  REGION_ICON_MAP,
} from "@/features/regions-management/config";

/* ─── Helpers ─── */
function getFieldValue(obj, field) {
  if (!obj) return null;
  const raw = obj[field.key];
  if (raw === null || raw === undefined || raw === "") return null;

  switch (field.type) {
    case "nested":
      return raw?.[field.nestedKey] || "—";
    default:
      return field.format ? field.format(raw) : String(raw);
  }
}

function FieldIcon({ fieldKey, className = "text-muted mt-0.5 shrink-0" }) {
  const Icon = REGION_ICON_MAP[fieldKey] || MapPin;
  return <Icon size={16} className={className} />;
}

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, label, value, colorClass }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface border border-border">
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
              {visible.map((field) => (
                <div
                  key={field.key}
                  className={`flex items-start gap-2 p-2.5 rounded-lg bg-surface border border-border ${
                    field.fullWidth ? "sm:col-span-2" : ""
                  }`}
                >
                  <FieldIcon fieldKey={field.key} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted uppercase tracking-wide">{field.label}</p>
                    <p className="text-sm text-foreground font-medium wrap-break-word">
                      {getFieldValue(data, field)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Neighborhoods Grid ─── */
function NeighborhoodsGrid({ neighborhoods = [] }) {
  if (neighborhoods.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted">
        محله‌ای ثبت نشده است
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
          <Home size={14} className="text-emerald-500 shrink-0" />
          <span className="text-sm text-foreground">{n.name}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Agents List ─── */
function AgentsList({ agents = [] }) {
  if (agents.length === 0) {
    return (
      <div className="py-12 text-center space-y-3">
        <Users size={48} className="mx-auto text-muted/40" />
        <p className="text-sm text-muted">کارشناسی در این منطقه فعالیت ندارد</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pr-1" dir="rtl">
      {agents.map((agent) => (
        <div
          key={agent.id}
          className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border"
        >
          <div className="w-10 h-10 rounded-full bg-(--role-subtle)/20 flex items-center justify-center text-(--role-primary) text-sm font-bold shrink-0">
            {agent.full_name?.charAt(0) || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{agent.full_name}</p>
              <RoleBadge role={agent.role?.[0]} variant="soft" size="sm" />
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Phone size={11} />
                <a href={`tel:${agent.phone}`} className="dir-ltr hover:text-(--role-primary)">
                  {agent.phone}
                </a>
              </span>
              {agent.service_neighborhoods?.length > 0 && (
                <span className="flex items-center gap-1">
                  <MapPin size={11} />
                  {agent.service_neighborhoods.length} محله
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Stats Tab ─── */
function StatsTab({ stats }) {
  return (
    <div className="space-y-6 pr-1" dir="rtl">
      <div>
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3 border-b border-border pb-1">
          آمار کلی منطقه
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={FileText} label="آگهی‌ها" value={stats.listings_count} colorClass={{ bg: "bg-violet-500/10", text: "text-violet-500" }} />
          <StatCard icon={Home} label="املاک" value={stats.properties_count} colorClass={{ bg: "bg-emerald-500/10", text: "text-emerald-500" }} />
          <StatCard icon={PhoneCall} label="تماس‌ها" value={stats.calls_count} colorClass={{ bg: "bg-sky-500/10", text: "text-sky-500" }} />
          <StatCard icon={ClipboardList} label="پیگیری‌ها" value={stats.followups_count} colorClass={{ bg: "bg-amber-500/10", text: "text-amber-500" }} />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-3 border-b border-border pb-1">
          پوشش منطقه
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard icon={Home} label="محله‌ها" value={stats.neighborhoods_count} colorClass={{ bg: "bg-indigo-500/10", text: "text-indigo-500" }} />
          <StatCard icon={Building2} label="آدرس‌ها" value={stats.addresses_count} colorClass={{ bg: "bg-rose-500/10", text: "text-rose-500" }} />
          <StatCard icon={Users} label="کارشناسان" value={stats.agents_count} colorClass={{ bg: "bg-teal-500/10", text: "text-teal-500" }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Modal ─── */
export default function RegionDetailModal({
  isOpen,
  onClose,
  region,
  agents = [],
  stats = {},
}) {
  const [activeTab, setActiveTab] = useState("details");
  if (!region) return null;

  useMemo(() => {
    if (isOpen) setActiveTab("details");
  }, [isOpen, region.id]);

  return (
    <Modal className="h-[85vh]" isOpen={isOpen} onClose={onClose} size="xl" title="جزئیات منطقه">
      {/* ═══ Header ═══ */}
      <div className="flex shrink-0 items-start gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-14 h-14 rounded-xl bg-(--role-subtle)/20 flex items-center justify-center text-(--role-primary) shrink-0">
          <MapPin size={26} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground">{region.name}</h3>
          <p className="text-sm text-muted mt-0.5">
            {region.city?.name || "—"} / {region.city?.province?.name || "—"}
          </p>

          {/* Stats Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-500">
              <Home size={10} />
              {region.neighborhoods_count?.toLocaleString("fa-IR") || "۰"} محله
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-sky-500/10 text-sky-500">
              <Building2 size={10} />
              {region.addresses_count?.toLocaleString("fa-IR") || "۰"} آدرس
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-violet-500/10 text-violet-500">
              <FileText size={10} />
              {region.listings_count?.toLocaleString("fa-IR") || "۰"} آگهی
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-500">
              <Users size={10} />
              {region.agents_count?.toLocaleString("fa-IR") || "۰"} کارشناس
            </span>
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
          {REGION_DETAIL_TABS.map((tab) => (
            <Tabs.Trigger key={tab.key} value={tab.key} icon={tab.icon}>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {/* ── Tab 1: Details ── */}
          <Tabs.Content value="details">
            <div className="space-y-6">
              <FieldGrid
                data={region}
                sections={REGION_DETAIL_FIELDS}
                emptyText="اطلاعات منطقه یافت نشد"
              />
              <div>
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 border-b border-border pb-1">
                  محله‌های تحت پوشش
                </h4>
                <NeighborhoodsGrid neighborhoods={region.neighborhoods} />
              </div>
            </div>
          </Tabs.Content>

          {/* ── Tab 2: Agents ── */}
          <Tabs.Content value="agents">
            <AgentsList agents={agents} />
          </Tabs.Content>

          {/* ── Tab 3: Stats ── */}
          <Tabs.Content value="stats">
            <StatsTab stats={stats} />
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