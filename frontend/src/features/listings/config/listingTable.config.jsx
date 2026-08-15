import StatusBadge from "@/shared/ui/badges/StatusBadge";
import SourceBadge from "@/shared/ui/badges/SourceBadge";
import {
  LISTING_STATUS_CONFIG,
  LISTING_REVIEW_STATUS_CONFIG,
} from "@/features/listings/config";
import { buildStatusConfig } from "@/constants/status.utils";
import { formatPrice, formatDate } from "@/utils/formatters";

/**
 * فقط فیلدهای ListingListSerializer:
 * id, source, external_id, url, status, review_status,
 * title, listed_sale_price, listed_rent_amount,
 * published_at, first_seen_at, last_seen_at
 */
export const LISTING_TABLE_COLUMNS = [
  {
    key: "id",
    header: "شناسه",
    width: "w-16",
    cell: ({ id }) => (
      <span className="text-xs text-muted-foreground font-mono">#{id}</span>
    ),
  },
  {
    key: "title",
    header: "عنوان آگهی",
    width: "w-56",
    cell: ({ title, external_id }) => (
      <div className="flex flex-col">
        <span className="font-medium truncate max-w-50" title={title}>
          {title || "—"}
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          {external_id || "—"}
        </span>
      </div>
    ),
  },
  // {
  //   key: "source",
  //   header: "منبع",
  //   width: "w-28",
  //   cell: ({ source }) => <SourceBadge source={source?.name || "—"} />,
  // },
  {
    key: "price",
    header: "قیمت / اجاره",
    width: "w-36",
    cell: ({ listed_sale_price, listed_rent_amount }) => {
      if (listed_sale_price) {
        return (
          <span className="font-medium text-emerald-600">
            {formatPrice(listed_sale_price)}
          </span>
        );
      }
      if (listed_rent_amount) {
        return (
          <span className="font-medium text-sky-600">
            {formatPrice(listed_rent_amount)}
          </span>
        );
      }
      return <span className="text-muted-foreground text-xs">—</span>;
    },
  },
  {
    key: "status",
    header: "وضعیت آگهی",
    width: "w-28",
    cell: ({ status }) => (
      <StatusBadge config={buildStatusConfig(LISTING_STATUS_CONFIG, status)} />
    ),
  },
  {
    key: "review_status",
    header: "وضعیت بررسی",
    width: "w-28",
    cell: ({ review_status }) => (
      <StatusBadge
        config={buildStatusConfig(LISTING_REVIEW_STATUS_CONFIG, review_status)}
      />
    ),
  },
  {
    key: "published_at",
    header: "انتشار",
    width: "w-32",
    cell: ({ published_at }) => formatDate(published_at, "short"),
  },
  // {
  //   key: "first_seen",
  //   header: "اولین مشاهده",
  //   width: "w-32",
  //   cell: ({ first_seen_at }) => formatDate(first_seen_at, "short"),
  // },
  // {
  //   key: "last_seen",
  //   header: "آخرین مشاهده",
  //   width: "w-32",
  //   cell: ({ last_seen_at }) => formatDate(last_seen_at, "short"),
  // },
  {
    key: "actions",
    header: "",
    width: "w-24",
    actions: true,
  },
];