import { StatusBadge } from "@/shared/ui/badges/StatusBadge";
import { PROPERTY_STATUS_CONFIG } from "@/constants/propertyStatus.config";
import { PROPERTY_DEAL_TYPE_CONFIG } from "@/constants/propertyDealType.config";
import { formatPrice, formatDate } from "@/utils/formatters";

/**
 * Property Table Columns
 * Backend: properties.Property
 */
export const PROPERTY_TABLE_COLUMNS = [
  {
    key: "property_code",
    header: "کد ملک",
    width: "w-28",
    searchable: true,
    cell: ({ property_code }) => (
      <span className="text-xs font-mono font-semibold text-primary">{property_code}</span>
    ),
  },
  {
    key: "title",
    header: "عنوان ملک",
    width: "w-56",
    searchable: true,
    cell: ({ title, address }) => (
      <div className="flex flex-col">
        <span className="font-medium truncate max-w-50" title={title}>{title}</span>
        <span className="text-xs text-muted-foreground truncate max-w-50">
          {address?.full_text || "—"}
        </span>
      </div>
    ),
  },
  {
    key: "deal_type",
    header: "نوع معامله",
    width: "w-24",
    cell: ({ deal_type }) => {
      const cfg = PROPERTY_DEAL_TYPE_CONFIG[deal_type];
      if (!cfg) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
          <cfg.icon className={`w-3.5 h-3.5 text-${cfg.color}-500`} />
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "وضعیت",
    width: "w-24",
    filterKey: "status",
    cell: ({ status }) => <StatusBadge status={status} config={PROPERTY_STATUS_CONFIG} />,
  },
  {
    key: "owner",
    header: "مالک",
    width: "w-32",
    searchable: true,
    searchFields: ["owner.full_name", "owner.phone"],
    cell: ({ owner }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">{owner?.full_name || "—"}</span>
        <span className="text-xs text-muted-foreground font-mono ltr">{owner?.phone || "—"}</span>
      </div>
    ),
  },
  {
    key: "agent",
    header: "مشاور",
    width: "w-32",
    cell: ({ agent }) => (
      <span className="text-sm">{agent?.full_name || "—"}</span>
    ),
  },
  {
    key: "area",
    header: "متراژ",
    width: "w-20",
    cell: ({ area }) => area ? <span>{area} م²</span> : <span className="text-muted-foreground text-xs">—</span>,
  },
  {
    key: "bedrooms",
    header: "خواب",
    width: "w-16",
    cell: ({ bedrooms }) => <span className="text-sm">{bedrooms || 0}</span>,
  },
  {
    key: "floor",
    header: "طبقه",
    width: "w-16",
    cell: ({ floor, total_floors }) => (
      <span className="text-sm">{floor != null ? `${floor} / ${total_floors || "?"}` : "—"}</span>
    ),
  },
  {
    key: "age",
    header: "سن",
    width: "w-16",
    cell: ({ age }) => <span className="text-sm">{age || 0} سال</span>,
  },
  {
    key: "price",
    header: "قیمت / اجاره",
    width: "w-36",
    cell: ({ sale_price, monthly_rent, mortgage_amount, deal_type }) => {
      if (deal_type === "sale" && sale_price) return <span className="font-medium text-emerald-600">{formatPrice(sale_price)}</span>;
      if (deal_type === "rent" && monthly_rent) return <span className="font-medium text-sky-600">{formatPrice(monthly_rent)}</span>;
      if (deal_type === "mortgage" && mortgage_amount) return <span className="font-medium text-amber-600">{formatPrice(mortgage_amount)}</span>;
      return <span className="text-muted-foreground text-xs">—</span>;
    },
  },
  {
    key: "created_at",
    header: "تاریخ ثبت",
    width: "w-28",
    cell: ({ created_at }) => formatDate(created_at, "short"),
  },
  {
    key: "actions",
    header: "",
    width: "w-20",
    actions: true,
  },
];