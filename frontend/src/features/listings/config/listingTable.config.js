import { StatusBadge } from "@/shared/ui/badges/StatusBadge";
import { SourceBadge } from "@/shared/ui/badges/SourceBadge";
import { LISTING_STATUS_CONFIG } from "@/constants/listingStatus.config";
import { LISTING_REVIEW_STATUS_CONFIG } from "@/constants/listingReviewStatus.config";
import { PROPERTY_DEAL_TYPE_CONFIG } from "@/constants/propertyDealType.config";
import { formatPrice, formatDate } from "@/utils/formatters";

/**
 * Listing Table Columns
 * Backend: listing.Listing
 */
export const LISTING_TABLE_COLUMNS = [
  {
    key: "id",
    header: "شناسه",
    width: "w-16",
    cell: ({ id }) => <span className="text-xs text-muted-foreground font-mono">#{id}</span>,
  },
  {
    key: "title",
    header: "عنوان آگهی",
    width: "w-56",
    searchable: true,
    cell: ({ title, external_id }) => (
      <div className="flex flex-col">
        <span className="font-medium truncate max-w-50" title={title}>{title}</span>
        <span className="text-xs text-muted-foreground font-mono">{external_id}</span>
      </div>
    ),
  },
  {
    key: "source",
    header: "منبع",
    width: "w-28",
    cell: ({ source }) => <SourceBadge source={source?.name || "—"} />,
  },
  {
    key: "deal_type",
    header: "نوع معامله",
    width: "w-28",
    cell: ({ listed_sale_price, listed_rent_amount, listed_mortgage_amount }) => {
      let type = "sale";
      if (listed_rent_amount) type = "rent";
      else if (listed_mortgage_amount && !listed_sale_price) type = "mortgage";
      const cfg = PROPERTY_DEAL_TYPE_CONFIG[type];
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
          <cfg.icon className={`w-3.5 h-3.5 text-${cfg.color}-500`} />
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "price",
    header: "قیمت / اجاره",
    width: "w-36",
    cell: ({ listed_sale_price, listed_rent_amount, listed_deposit_amount, listed_mortgage_amount }) => {
      if (listed_sale_price) return <span className="font-medium text-emerald-600">{formatPrice(listed_sale_price)}</span>;
      if (listed_rent_amount) return <span className="font-medium text-sky-600">{formatPrice(listed_rent_amount)}</span>;
      if (listed_mortgage_amount) return <span className="font-medium text-amber-600">{formatPrice(listed_mortgage_amount)}</span>;
      return <span className="text-muted-foreground text-xs">—</span>;
    },
  },
  {
    key: "area",
    header: "متراژ",
    width: "w-20",
    cell: ({ listed_area }) => listed_area ? <span>{listed_area} م²</span> : <span className="text-muted-foreground text-xs">—</span>,
  },
  {
    key: "status",
    header: "وضعیت آگهی",
    width: "w-28",
    filterKey: "status",
    cell: ({ status }) => <StatusBadge status={status} config={LISTING_STATUS_CONFIG} />,
  },
  {
    key: "review_status",
    header: "وضعیت بررسی",
    width: "w-28",
    filterKey: "review_status",
    cell: ({ review_status }) => <StatusBadge status={review_status} config={LISTING_REVIEW_STATUS_CONFIG} />,
  },
  {
    key: "first_seen",
    header: "اولین مشاهده",
    width: "w-32",
    cell: ({ first_seen_at }) => formatDate(first_seen_at, "short"),
  },
  {
    key: "last_seen",
    header: "آخرین مشاهده",
    width: "w-32",
    cell: ({ last_seen_at }) => formatDate(last_seen_at, "short"),
  },
  {
    key: "media_count",
    header: "رسانه",
    width: "w-16",
    cell: ({ media_count }) => (
      <span className="text-xs text-muted-foreground">{media_count || 0} تصویر</span>
    ),
  },
  {
    key: "actions",
    header: "",
    width: "w-20",
    actions: true,
  },
];