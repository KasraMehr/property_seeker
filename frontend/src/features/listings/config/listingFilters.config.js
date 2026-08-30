import {
  LISTING_STATUS_CONFIG,
  LISTING_REVIEW_STATUS_CONFIG,
  LISTING_ADVERTISER_TYPE_CONFIG,
} from "@/features/listings/config";

/**
 * Listing Filters — Just active filters 
 * other filters have UI but no backend supports
 */

export const LISTING_QUICK_FILTERS = [
  {
    key: "search",
    label: "جستجو",
    type: "search",
    placeholder: "عنوان، شناسه خارجی...",
    fields: ["title", "external_id"],
    placement: "bar",
  },
  {
    key: "status",
    label: "وضعیت آگهی",
    type: "multi_select",
    placement: "bar",
    options: Object.entries(LISTING_STATUS_CONFIG).map(([value, cfg]) => ({
      value,
      label: cfg.label,
    })),
  },
  {
    key: "review_status",
    label: "وضعیت بررسی",
    type: "multi_select",
    placement: "bar",
    options: Object.entries(LISTING_REVIEW_STATUS_CONFIG).map(
      ([value, cfg]) => ({
        value,
        label: cfg.label,
      }),
    ),
  },
  {
    key: "advertiser_type",
    label: "نوع آگهی‌دهنده",
    type: "multi_select",
    placement: "bar",
    options: Object.entries(LISTING_ADVERTISER_TYPE_CONFIG).map(
      ([value, cfg]) => ({
        value,
        label: cfg.label,
      }),
    ),
  },
  {
    key: "deal_type",
    label: "نوع معامله",
    type: "multi_select",
    placement: "bar",
    options: [
      { value: "sale", label: "فروش" },
      { value: "rent", label: "اجاره" },
      { value: "mortage", label: "رهن" },
      { value: "exchange", label: "معاوضه" },
    ],
    // client-side: sale → listed_sale_price, rent → listed_rent_amount
  },
];

export const LISTING_ADVANCED_FILTERS = [
  // ── غیرفعال تا وقتی بک‌اند فیلتر سرور اضافه کند ──
  // {
  //   key: "source",
  //   label: "منبع",
  //   type: "multi_select",
  //   placement: "drawer",
  //   async: true,
  //   endpoint: "/api/listing/sources/",
  //   optionLabel: "name",
  //   optionValue: "id",
  // },
  // {
  //   key: "price_range",
  //   label: "محدوده قیمت",
  //   type: "range",
  //   placement: "drawer",
  //   min_key: "price_min",
  //   max_key: "price_max",
  //   step: 1_000_000,
  //   unit: "تومان",
  // },
  // {
  //   key: "area",
  //   label: "متراژ",
  //   type: "range",
  //   placement: "drawer",
  //   min_key: "area_min",
  //   max_key: "area_max",
  //   step: 5,
  //   unit: "متر",
  // },
  // {
  //   key: "bedrooms",
  //   label: "تعداد اتاق",
  //   type: "range",
  //   placement: "drawer",
  //   min_key: "room_min",
  //   max_key: "room_max",
  //   step: 1,
  //   unit: "اتاق",
  // },
  // {
  //   key: "floor",
  //   label: "طبقه",
  //   type: "range",
  //   placement: "drawer",
  //   min_key: "floor_min",
  //   max_key: "floor_max",
  //   step: 1,
  //   unit: "طبقه",
  // },
  // {
  //   key: "first_seen",
  //   label: "اولین مشاهده",
  //   type: "date_range",
  //   placement: "drawer",
  //   from_key: "first_seen_from",
  //   to_key: "first_seen_to",
  // },
  // {
  //   key: "last_seen",
  //   label: "آخرین مشاهده",
  //   type: "date_range",
  //   placement: "drawer",
  //   from_key: "last_seen_from",
  //   to_key: "last_seen_to",
  // },
  // {
  //   key: "published_at",
  //   label: "تاریخ انتشار",
  //   type: "date_range",
  //   placement: "drawer",
  //   from_key: "published_from",
  //   to_key: "published_to",
  // },
];

export const LISTING_ALL_FILTERS = [
  ...LISTING_QUICK_FILTERS,
  ...LISTING_ADVANCED_FILTERS,
];
