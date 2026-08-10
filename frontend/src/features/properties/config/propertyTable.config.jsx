import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { PROPERTY_STATUS_CONFIG , PROPERTY_DEAL_TYPE_CONFIG } from "@/features/properties/config";
import { formatPrice } from "@/utils/formatters";

/**
 * Property Table Columns
 * Backend: properties.PropertyListSerializer
 * Available fields in list: id, agency, property_code, title, owner (string),
 *   agent (string), created_by (string), city (string), property_type,
 *   deal_type, area, sale_price, monthly_rent, status
 *
 * NOTE: Fields like bedrooms, floor, age, created_at, price_per_meter,
 *   address/district are ONLY available in PropertyDetailSerializer.
 *   Add them back here only after backend expands PropertyListSerializer.
 */
export const PROPERTY_TYPE_CONFIG = {
  APARTMENT: { label: "آپارتمان" },
  VILLA: { label: "ویلا" },
  LAND: { label: "زمین" },
  COMMERCIAL: { label: "تجاری" },
  OFFICE: { label: "دفتر" },
  STORE: { label: "مغازه" },
};
export const PROPERTY_TABLE_COLUMNS = [
  {
    key: "property_code",
    header: "کد ملک",
    width: "w-28",
    searchable: true,
    cell: ({ property_code }) => (
      <span className="text-xs font-mono font-semibold text-primary">
        {property_code}
      </span>
    ),
  },
  {
    key: "title",
    header: "عنوان ملک",
    width: "w-56",
    searchable: true,
    cell: ({ title, city }) => (
      <div className="flex flex-col">
        <span className="font-medium truncate max-w-50" title={title}>
          {title}
        </span>
        <span className="text-xs text-muted-foreground truncate max-w-50">
          {city || "—"}
        </span>
      </div>
    ),
  },
  {
    key: "property_type",
    header: "نوع ملک",
    width: "w-24",
    cell: ({ property_type }) => (
      <span className="text-xs text-muted-foreground">
        {property_type || "—"}
      </span>
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
    cell: ({ status }) => (
      <StatusBadge status={status} config={PROPERTY_STATUS_CONFIG} />
    ),
  },
  {
    key: "owner",
    header: "مالک",
    width: "w-32",
    searchable: true,
    // owner is a plain string in PropertyListSerializer (e.g. "علی احمدی")
    cell: ({ owner }) => <span className="text-sm">{owner || "—"}</span>,
  },
  {
    key: "agent",
    header: "مشاور",
    width: "w-32",
    // agent is a plain string in PropertyListSerializer
    cell: ({ agent }) => <span className="text-sm">{agent || "—"}</span>,
  },
  {
    key: "area",
    header: "متراژ",
    width: "w-20",
    cell: ({ area }) =>
      area ? (
        <span>{area} م²</span>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      ),
  },
  {
    key: "price",
    header: "قیمت / اجاره",
    width: "w-36",
    cell: ({ sale_price, monthly_rent, deal_type }) => {
      if (deal_type === "sale" && sale_price)
        return (
          <span className="font-medium text-emerald-600">
            {formatPrice(sale_price)}
          </span>
        );
      if (deal_type === "rent" && monthly_rent)
        return (
          <span className="font-medium text-sky-600">
            {formatPrice(monthly_rent)}
          </span>
        );
      if (deal_type === "mortgage")
        return (
          <span className="text-muted-foreground text-xs">
            مشاهده در جزئیات
          </span>
        );
      if (deal_type === "exchange")
        return <span className="text-muted-foreground text-xs">معاوضه</span>;
      return <span className="text-muted-foreground text-xs">—</span>;
    },
  },
  {
    key: "actions",
    header: "",
    width: "w-20",
    actions: true,
  },
];
