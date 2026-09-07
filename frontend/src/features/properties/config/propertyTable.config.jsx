import StatusBadge from "@/shared/ui/badges/StatusBadge";
import {
  PROPERTY_STATUS_CONFIG,
  PROPERTY_DEAL_TYPE_CONFIG,
  PROPERTY_TYPE_CONFIG,
} from "@/features/properties/config";
import { buildStatusConfig } from "@/constants/status.utils";
import { formatPrice } from "@/utils/formatters";

/**
 * Property Table Columns
 * Backend: properties.PropertyListSerializer
 * Available fields in list: id, agency, property_code, title, owner (string),
 *   agent (string), created_by (string), city (string), property_type,
 *   deal_type, area, sale_price, monthly_rent, status,
 *   created_at, updated_at
 */

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
      <StatusBadge
        config={buildStatusConfig(PROPERTY_TYPE_CONFIG, property_type)}
      />
    ),
  },
  {
    key: "deal_type",
    header: "نوع معامله",
    width: "w-24",
    cell: ({ deal_type }) => {
      const cfg = PROPERTY_DEAL_TYPE_CONFIG[deal_type];
      if (!cfg) {
        return (
          <span className="text-muted-foreground text-xs">—</span>
        );
      }

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
    cell: ({ status }) => (
      <StatusBadge
        config={buildStatusConfig(PROPERTY_STATUS_CONFIG, status)}
      />
    ),
  },
  {
    key: "owner",
    header: "مالک",
    width: "w-32",
    searchable: true,
    cell: ({ owner }) => (
      <span className="text-sm">{owner || "—"}</span>
    ),
  },
  {
    key: "agent",
    header: "مشاور",
    width: "w-32",
    cell: ({ agent }) => (
      <span className="text-sm">{agent || "—"}</span>
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
        return (
          <span className="text-muted-foreground text-xs">
            معاوضه
          </span>
        );

      return (
        <span className="text-muted-foreground text-xs">—</span>
      );
    },
  },
  {
    key: "created_at",
    header: "تاریخ ایجاد",
    width: "w-40",
    cell: ({ created_at }) => (
      <span className="text-sm">
        {created_at
          ? new Date(created_at).toLocaleString("fa-IR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—"}
      </span>
    ),
  },
  {
    key: "updated_at",
    header: "آخرین ویرایش",
    width: "w-40",
    cell: ({ updated_at }) => (
      <span className="text-sm">
        {updated_at
          ? new Date(updated_at).toLocaleString("fa-IR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—"}
      </span>
    ),
  },
  // {
  //   key: "actions",
  //   header: "",
  //   width: "w-20",
  //   actions: true,
  // },
];
