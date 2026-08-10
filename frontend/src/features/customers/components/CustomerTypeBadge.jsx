import { forwardRef } from "react";
import {
  ShoppingBag,
  Home,
  Key,
  Building2,
  TrendingUp,
} from "lucide-react";

const TYPE_MAP = {
  buyer: {
    label: "خریدار",
    icon: ShoppingBag,
    bg: "bg-sky-500/10",
    text: "text-sky-600",
  },
  seller: {
    label: "فروشنده",
    icon: Home,
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
  },
  tenant: {
    label: "مستأجر",
    icon: Key,
    bg: "bg-amber-500/10",
    text: "text-amber-600",
  },
  landlord: {
    label: "موجر",
    icon: Building2,
    bg: "bg-violet-500/10",
    text: "text-violet-600",
  },
  investor: {
    label: "سرمایه‌گذار",
    icon: TrendingUp,
    bg: "bg-rose-500/10",
    text: "text-rose-600",
  },
};

const CustomerTypeBadge = forwardRef(
  ({ type, size = "sm", showIcon = true, className = "", ...props }, ref) => {
    const cfg = TYPE_MAP[type] || {
      label: type || "—",
      icon: null,
      bg: "bg-muted/10",
      text: "text-muted-foreground",
    };

    const Icon = cfg.icon;

    const sizeClass =
      size === "md"
        ? "px-2.5 py-1 text-xs gap-1.5 rounded-full"
        : "px-2 py-0.5 text-[10px] gap-1 rounded-full";

    const iconSize = size === "md" ? 12 : 10;

    return (
      <span
        ref={ref}
        className={`inline-flex items-center font-medium whitespace-nowrap ${cfg.bg} ${cfg.text} ${sizeClass} ${className}`}
        {...props}
      >
        {showIcon && Icon && <Icon size={iconSize} strokeWidth={2.2} />}
        {cfg.label}
      </span>
    );
  }
);

CustomerTypeBadge.displayName = "CustomerTypeBadge";
export default CustomerTypeBadge;