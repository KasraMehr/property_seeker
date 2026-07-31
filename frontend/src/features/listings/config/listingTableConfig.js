import { LISTING_FILTERS } from "@/constants/filterConfig";

export const FILTER_SCHEMA_NO_SEARCH = LISTING_FILTERS.filter((f) => f.key !== "search");

export const PAGE_SIZE = 10;

export const SORTABLE_COLS = {
  title: { label: "عنوان", align: "right" },
  status: { label: "وضعیت", align: "center", width: "100px" },
  score: { label: "امتیاز", align: "center", width: "80px" },
  district: { label: "منطقه", align: "right", width: "140px" },
  price: { label: "قیمت", align: "right", width: "140px" },
  info: { label: "سال / اتاق / طبقه", align: "center", width: "120px" },
  source: { label: "منبع", align: "center", width: "80px" },
  actions: { label: "عملیات", align: "center", width: "160px" },
};

export const DEFAULT_SORT = { column: "score", direction: "desc" };

// ── Format helpers ──
export const fmtPrice = (row) => {
  if (row.listed_sale_price) {
    if (row.listed_sale_price >= 1_000_000_000)
      return `${(row.listed_sale_price / 1_000_000_000).toFixed(1)} میلیارد`;
    return `${(row.listed_sale_price / 1_000_000).toFixed(0)} میلیون`;
  }
  if (row.listed_rent_amount) {
    const rent = `${(row.listed_rent_amount / 1_000_000).toFixed(1)} میلیون`;
    const deposit = row.deposit_toman || row.listed_deposit_amount;
    if (deposit) {
      const depositFmt =
        deposit >= 1_000_000_000
          ? `${(deposit / 1_000_000_000).toFixed(1)} میلیارد`
          : `${(deposit / 1_000_000).toFixed(0)} میلیون`;
      return `ودیعه ${depositFmt} / اجاره ${rent}`;
    }
    return `${rent} اجاره`;
  }
  return "—";
};

export const fmtYearRoomsFloor = (row) =>
  `${row.build_year ?? "—"} / ${row.room_count ?? "—"}خ / ط${row.floor_number ?? "—"}`;

export const fmtSource = (source) => {
  const map = { divar: "دیوار", sheypoor: "شیپور", internal: "داخلی" };
  return map[source] || source || "—";
};

// ── Detail modal fields ──
export const DETAIL_FIELDS = [
  { key: "id", label: "شناسه" },
  { key: "title", label: "عنوان" },
  { key: "phone", label: "شماره تماس" },
  { key: "source", label: "منبع", format: fmtSource },
  { key: "status", label: "وضعیت", isBadge: "status" },
  { key: "score", label: "امتیاز", isBadge: "score" },
  { key: "district", label: "منطقه", format: (v) => v?.name || "—" },
  { key: "assigned_to", label: "تخصیص یافته به", format: (v) => v?.full_name || "تخصیص نشده" },
  { key: "build_year", label: "سال ساخت" },
  { key: "room_count", label: "تعداد اتاق" },
  { key: "floor_number", label: "طبقه" },
  { key: "listed_area", label: "متراژ", suffix: " متر" },
  { key: "listed_sale_price", label: "قیمت فروش", format: (v) => v ? `${(v / 1_000_000).toFixed(0)} میلیون` : "—" },
  { key: "listed_rent_amount", label: "اجاره", format: (v) => v ? `${(v / 1_000_000).toFixed(1)} میلیون` : "—" },
  { key: "listed_deposit_amount", label: "ودیعه", format: (v) => v ? `${(v / 1_000_000).toFixed(0)} میلیون` : "—" },
  { key: "price_per_meter_toman", label: "قیمت هر متر", format: (v) => v ? v.toLocaleString("fa-IR") : "—" },
  { key: "call_count", label: "تعداد تماس" },
  { key: "views_count", label: "بازدید" },
  { key: "leads_count", label: "لیدها" },
  { key: "media_count", label: "تعداد رسانه" },
  { key: "external_id", label: "شناسه خارجی" },
  { key: "created_at", label: "تاریخ ایجاد", format: (v) => v ? new Date(v).toLocaleDateString("fa-IR") : "—" },
  { key: "updated_at", label: "تاریخ بروزرسانی", format: (v) => v ? new Date(v).toLocaleDateString("fa-IR") : "—" },
  { key: "published_at", label: "تاریخ انتشار", format: (v) => v ? new Date(v).toLocaleDateString("fa-IR") : "—" },
  { key: "expires_at", label: "تاریخ انقضا", format: (v) => v ? new Date(v).toLocaleDateString("fa-IR") : "—" },
  { key: "description", label: "توضیحات", fullWidth: true },
];