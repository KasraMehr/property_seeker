import { Home, KeyRound, Building2, Store, Crown } from "lucide-react";

/**
 * DealTypeBadge — نمایش نوع معامله کاربر.
 *
 * - برای کاربر عادی: مقدار User.deal_type_scope (DealTypeScope).
 * - برای مالک آژانس: نوع معامله ندارد و به همه بخش‌ها دسترسی دارد؛
 *   بج «همه معاملات» نمایش داده می‌شود.
 */

const DEAL_TYPE_STYLES = {
  "rent-residential": {
    label: "اجارهٔ مسکونی",
    icon: KeyRound,
    classes: "bg-sky-500/10 text-sky-600",
  },
  "buy-residential": {
    label: "فروش مسکونی",
    icon: Home,
    classes: "bg-emerald-500/10 text-emerald-600",
  },
  "buy-commercial-property": {
    label: "فروش اداری و تجاری",
    icon: Building2,
    classes: "bg-amber-500/10 text-amber-600",
  },
  "rent-commercial-property": {
    label: "اجارهٔ اداری و تجاری",
    icon: Store,
    classes: "bg-indigo-500/10 text-indigo-600",
  },
};

const OWNER_STYLE = {
  label: "همه معاملات",
  icon: Crown,
  classes: "bg-violet-500/10 text-violet-600",
};

const sizeMap = {
  sm: "px-2 py-0.5 text-[10px] gap-1 rounded-full",
  md: "px-2.5 py-1 text-xs gap-1.5 rounded-full",
};

export function getDealTypeLabel(value, isOwner = false) {
  if (isOwner) return OWNER_STYLE.label;
  return DEAL_TYPE_STYLES[value]?.label ?? value ?? "—";
}

export default function DealTypeBadge({
  value,
  isOwner = false,
  size = "md",
  showIcon = true,
  className = "",
}) {
  const style = isOwner
    ? OWNER_STYLE
    : (DEAL_TYPE_STYLES[value] ?? null);

  if (!style) {
    return (
      <span
        className={`inline-flex items-center font-medium text-muted-foreground ${sizeMap[size]} ${className}`}
      >
        —
      </span>
    );
  }

  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center font-medium whitespace-nowrap shrink-0 ${sizeMap[size]} ${style.classes} ${className}`}
    >
      {showIcon && Icon && <Icon size={12} strokeWidth={2.2} />}
      {style.label}
    </span>
  );
}
