import {
  LISTING_STATUS_CONFIG,
  LISTING_REVIEW_STATUS_CONFIG,
} from "@/features/listings/config";

/**
 * Listing Filters — All backed by server-side ListingFilter (django_filters)
 *
 * Quick:  search, status, review_status
 * Advanced: price, rent, area, build year, floor, room, total floors, booleans, dates
 *
 * NOTE: advertiser_type is handled via tabs (not filter chips), so it is NOT in this schema.
 * NOTE: source filter excluded — backend filter exists but no Source list endpoint yet.
 */

export const LISTING_QUICK_FILTERS = [
  {
    key: "search",
    label: "جستجو",
    type: "search",
    placeholder: "عنوان، شناسه خارجی...",
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
];

export const LISTING_ADVANCED_FILTERS = [
  // ── Price / Rent ──
  {
    key: "listed_sale_price",
    label: "قیمت فروش",
    type: "range",
    placement: "drawer",
    min_key: "listed_sale_price_min",
    max_key: "listed_sale_price_max",
    min: 0,
    max: 100_000_000_000,
    step: 1_000_000,
    unit: "تومان",
  },
  {
    key: "listed_rent_amount",
    label: "اجاره",
    type: "range",
    placement: "drawer",
    min_key: "listed_rent_amount_min",
    max_key: "listed_rent_amount_max",
    min: 0,
    max: 500_000_000,
    step: 100_000,
    unit: "تومان",
  },

  // ── Property Specifications ──
  {
    key: "listed_area",
    label: "متراژ",
    type: "range",
    placement: "drawer",
    min_key: "listed_area_min",
    max_key: "listed_area_max",
    min: 0,
    max: 2000,
    step: 5,
    unit: "متر",
  },

  {
    key: "floor_number",
    label: "طبقه",
    type: "range",
    placement: "drawer",
    min_key: "floor_number_min",
    max_key: "floor_number_max",
    min: -3,
    max: 50,
    step: 1,
    unit: "طبقه",
  },
  {
    key: "total_floors",
    label: "کل طبقات",
    type: "select",
    placement: "drawer",
    options: Array.from({ length: 31 }, (_, i) => ({
      value: String(i + 1),
      label: `${i + 1} طبقه`,
    })),
  },
  {
    key: "room_count",
    label: "تعداد اتاق",
    type: "select",
    placement: "drawer",
    options: Array.from({ length: 11 }, (_, i) => ({
      value: String(i),
      label: i === 0 ? "بدون اتاق" : `${i} اتاق`,
    })),
  },
  {
    key: "build_year",
    label: "سال ساخت",
    type: "range",
    placement: "drawer",
    min_key: "build_year_min",
    max_key: "build_year_max",
    min: 1350,
    max: 1405,
    step: 1,
    unit: "",
  },

  // ── Media / Engagement ──
  {
    key: "media_count",
    label: "تعداد عکس",
    type: "range",
    placement: "drawer",
    min_key: "media_count_min",
    max_key: "media_count_max",
    min: 0,
    max: 50,
    step: 1,
    unit: "",
  },
  {
    key: "views_count",
    label: "تعداد بازدید",
    type: "range",
    placement: "drawer",
    min_key: "views_count_min",
    max_key: "views_count_max",
    min: 0,
    max: 10000,
    step: 10,
    unit: "",
  },

  // ── Booleans ──
  {
    key: "pictures_match_property",
    label: "تصاویر مطابق ملک",
    type: "toggle",
    placement: "drawer",
  },
  {
    key: "removal_detected",
    label: "حذف شده از منبع",
    type: "toggle",
    placement: "drawer",
  },

  // ── Dates ──
  {
    key: "first_seen",
    label: "اولین مشاهده",
    type: "date_range",
    placement: "drawer",
    from_key: "first_seen_from",
    to_key: "first_seen_to",
  },
  {
    key: "last_seen",
    label: "آخرین مشاهده",
    type: "date_range",
    placement: "drawer",
    from_key: "last_seen_from",
    to_key: "last_seen_to",
  },
  {
    key: "created_at",
    label: "تاریخ ایجاد",
    type: "date_range",
    placement: "drawer",
    from_key: "created_from",
    to_key: "created_to",
  },
];

export const LISTING_ALL_FILTERS = [
  ...LISTING_QUICK_FILTERS,
  ...LISTING_ADVANCED_FILTERS,
];
