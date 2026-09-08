import StatusBadge from "@/shared/ui/badges/StatusBadge";
import {
  LISTING_STATUS_CONFIG,
  LISTING_ADVERTISER_TYPE_CONFIG,
  LISTING_REVIEW_STATUS_CONFIG,
  LISTING_ADVERTISER_CLASSIFICATION_STATUS_CONFIG,
} from "@/features/listings/config";
import { buildStatusConfig } from "@/constants/status.utils";
import { formatPrice } from "@/utils/formatters";

const CATEGORY_LABELS = {
  "rent-residential": "اجارهٔ مسکونی",
  "buy-residential": "فروش مسکونی",
  "buy-commercial-property": "فروش اداری و تجاری",
  "rent-commercial-property": "اجارهٔ اداری و تجاری",
};

/**
 * فقط فیلدهای ListingListSerializer:
 * id, source, external_id, url, status, review_status,
 * title, listed_sale_price, listed_rent_amount,
 * published_at, first_seen_at, last_seen_at
 */
export const LISTING_TABLE_COLUMNS = [
  // {
  //   key: "id",
  //   header: "شناسه",
  //   width: "w-16",
  //   cell: ({ id }) => (
  //     <span className="text-xs text-muted-foreground font-mono">
  //       #{id}
  //     </span>
  //   ),
  // },

  {
    key: "title",
    header: "عنوان آگهی",
    width: "w-56",
    cell: ({ title, external_id }) => (
      <div className="flex flex-col">
        <span
          className="font-medium truncate max-w-50"
          title={title}
        >
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
  //   cell: ({ source }) => (
  //     <SourceBadge source={source?.name || "—"} />
  //   ),
  // },

  {
    key: "category",
    header: "دسته‌بندی",
    width: "w-36",
    cell: ({ category }) => CATEGORY_LABELS[category] || "—",
  },

  {
    key: "divar_neighborhood",
    header: "منطقه / محله",
    width: "w-40",
    cell: ({ divar_neighborhood }) => (
      <div className="flex flex-col text-xs">
        <span>
          {divar_neighborhood?.zone_name || "منطقه تعیین نشده"}
        </span>

        <span className="text-muted-foreground">
          {divar_neighborhood?.name || "محله نامشخص"}
        </span>
      </div>
    ),
  },

  // {
  //   key: "contact_phone",
  //   header: "شماره تماس",
  //   width: "w-28",
  //   cell: ({ contact_phone }) => contact_phone || "—",
  // },

  {
    key: "advertiser_type",
    header: "آگهی‌دهنده",
    width: "w-32",
    cell: ({
      advertiser_type,
      advertiser_classification_status,
    }) => {
      const config =
        advertiser_classification_status === "succeeded" &&
        advertiser_type
          ? buildStatusConfig(
              LISTING_ADVERTISER_TYPE_CONFIG,
              advertiser_type,
            )
          : buildStatusConfig(
              LISTING_ADVERTISER_CLASSIFICATION_STATUS_CONFIG,
              advertiser_classification_status || "pending",
            );

      return <StatusBadge config={config} size="sm" />;
    },
  },

  {
    key: "price",
    header: "قیمت / اجاره",
    width: "w-36",
    cell: ({
      listed_sale_price,
      listed_rent_amount,
    }) => {
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

      return (
        <span className="text-muted-foreground text-xs">
          —
        </span>
      );
    },
  },

  {
    key: "status",
    header: "وضعیت آگهی",
    width: "w-28",
    cell: ({ status }) => (
      <StatusBadge
        config={buildStatusConfig(
          LISTING_STATUS_CONFIG,
          status,
        )}
      />
    ),
  },

  {
    key: "review_status",
    header: "وضعیت بررسی",
    width: "w-28",
    cell: ({ review_status }) => (
      <StatusBadge
        config={buildStatusConfig(
          LISTING_REVIEW_STATUS_CONFIG,
          review_status,
        )}
      />
    ),
  },

  {
    key: "published_at",
    header: "انتشار آگهی",
    width: "w-36",
    cell: ({ published_at, is_new, is_updated }) => {
      if (!published_at) {
        return (
          <span className="text-muted-foreground">
            —
          </span>
        );
      }

      const date = new Date(published_at);

      if (Number.isNaN(date.getTime())) {
        return (
          <span className="text-muted-foreground">
            —
          </span>
        );
      }

      const formatted = new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);

      return (
        <div className="flex items-center gap-1.5">
          {is_new && (
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="جدید" />
          )}
          {is_updated && (
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 shrink-0" title="به‌روز شده" />
          )}
          <span>{formatted}</span>
        </div>
      );
    },
  },
];