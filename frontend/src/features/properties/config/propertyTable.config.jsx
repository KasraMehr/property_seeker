import { formatPrice, formatDate } from "@/utils/formatters";
import { buildStatusConfig } from "@/constants/status.utils";
import { PROPERTY_STATUS_CONFIG } from "./propertyStatus.config";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import Thumbnail from "@/shared/ui/Thumbnail";
import { Home, MapPin, User, Briefcase } from "lucide-react";

/* ─── Helper: DealTypeTag ─── */
function DealTypeTag({ type }) {
  const map = {
    sale: { bg: "bg-emerald-500/10", text: "text-emerald-500", label: "فروش" },
    rent: { bg: "bg-sky-500/10", text: "text-sky-500", label: "اجاره" },
    mortgage: { bg: "bg-amber-500/10", text: "text-amber-500", label: "رهن" },
  };
  const cfg = map[type] || { bg: "bg-muted/10", text: "text-muted", label: type || "—" };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
}

/* ─── Helper: PropertyTypeTag ─── */
function PropertyTypeTag({ type }) {
  const map = {
    apartment: "آپارتمان",
    villa: "ویلا",
    land: "زمین",
    commercial: "تجاری",
    office: "اداری",
    store: "مغازه",
    workshop: "کارگاه",
  };
  return <span className="text-xs text-muted">{map[type] || type || "—"}</span>;
}

/* ─── Columns ─── */
export const PROPERTY_TABLE_COLUMNS = [
  {
    key: "title",
    title: "عنوان",
    width: "280px",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2.5 min-w-0">
        <Thumbnail src={row.hs_picture} alt={row.title} size="md" fallbackIcon={Home} />
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-medium text-sm text-foreground truncate max-w-56">
            {row.title}
          </span>
          <div className="flex items-center gap-1.5 text-muted text-[11px]">
            <span className="font-mono dir-ltr">{row.property_code}</span>
            <PropertyTypeTag type={row.property_type} />
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "status",
    title: "وضعیت",
    width: "90px",
    align: "center",
    sortable: true,
    render: (row) => {
      const config = buildStatusConfig(PROPERTY_STATUS_CONFIG, row.status);
      return <StatusBadge config={config} variant="soft" size="sm" />;
    },
  },
  {
    key: "deal_type",
    title: "معامله",
    width: "70px",
    align: "center",
    sortable: true,
    render: (row) => <DealTypeTag type={row.deal_type} />,
  },
  {
    key: "area",
    title: "متراژ",
    width: "80px",
    align: "center",
    sortable: true,
    render: (row) => (
      <span className="text-sm text-foreground">
        {row.area ? `${new Intl.NumberFormat("fa-IR").format(row.area)} متر` : "—"}
      </span>
    ),
  },
  {
    key: "price",
    title: "قیمت",
    width: "140px",
    sortable: true,
    render: (row) => {
      const price =
        row.deal_type === "sale"
          ? row.sale_price
          : row.deal_type === "rent"
            ? row.monthly_rent
            : row.deal_type === "mortgage"
              ? row.mortgage_amount
              : row.sale_price;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{formatPrice(price)}</span>
          {row.price_per_meter && row.deal_type === "sale" && (
            <span className="text-[10px] text-(--role-primary)">
              متری: {new Intl.NumberFormat("fa-IR").format(row.price_per_meter)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "location",
    title: "موقعیت",
    width: "140px",
    sortable: false,
    render: (row) => (
      <div className="flex items-center gap-1 text-muted text-xs">
        <MapPin size={12} />
        <span>{row.address?.district?.name || row.district?.name || "—"}</span>
      </div>
    ),
  },
  {
    key: "owner",
    title: "مالک",
    width: "120px",
    sortable: false,
    render: (row) => (
      <div className="flex items-center gap-1 text-muted text-xs">
        <User size={12} />
        <span>{row.owner?.full_name || "—"}</span>
      </div>
    ),
  },
  {
    key: "agent",
    title: "کارشناس",
    width: "120px",
    sortable: false,
    render: (row) => (
      <div className="flex items-center gap-1 text-muted text-xs">
        <Briefcase size={12} />
        <span>{row.agent?.full_name || "—"}</span>
      </div>
    ),
  },
  {
    key: "created_at",
    title: "تاریخ ثبت",
    width: "100px",
    align: "center",
    sortable: true,
    render: (row) => <span className="text-xs text-muted">{formatDate(row.created_at)}</span>,
  },
];