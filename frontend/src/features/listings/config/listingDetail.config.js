import {
  Hash,
  FileText,
  ExternalLink,
  Link2,
  Calendar,
  Home,
  Building,
  DollarSign,
  Image,
  Eye,
  UserPlus,
  CheckCircle2,
  Star,
  History,
  Target,
  GitCommit,
  AlertTriangle,
} from "lucide-react";

export const LISTING_DETAIL_TABS = [
  { key: "details", label: "جزئیات آگهی", icon: FileText },
  // { key: "snapshots", label: "اسنپ‌شات‌ها", icon: GitCommit },
  // { key: "targets", label: "تاریخچه تارگت", icon: Target },
];

export const LISTING_ICON_MAP = {
  id: Hash,
  external_id: Hash,
  title: FileText,
  source: ExternalLink,
  url: Link2,

  status: FileText,
  review_status: Star,

  build_year: Calendar,
  created_at: Calendar,
  updated_at: Calendar,
  published_at: Calendar,
  source_updated_at: Calendar,
  expires_at: Calendar,
  first_seen_at: Calendar,
  last_seen_at: Calendar,
  last_checked_at: Calendar,
  last_changed_at: Calendar,
  removal_detected_at: Calendar,

  listed_area: Home,
  floor_number: Building,
  total_floors: Building,
  room_count: Home,

  pictures_match_property: CheckCircle2,

  listed_sale_price: DollarSign,
  listed_price_per_meter: DollarSign,
  listed_mortgage_amount: DollarSign,
  listed_deposit_amount: DollarSign,
  listed_rent_amount: DollarSign,

  media_count: Image,
  views_count: Eye,
  leads_count: UserPlus,

  consecutive_failures: AlertTriangle,
  content_hash: Hash,
  latest_payload: FileText,
  description: FileText,
};

/** مطابق ListingDetailSerializer */
export const LISTING_DETAIL_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "id", label: "شناسه داخلی", format: (v) => `#${v}` },
      { key: "external_id", label: "شناسه خارجی (منبع)" },
      { key: "title", label: "عنوان آگهی", fullWidth: true },
      // { key: "contact_phone", label: "شماره تماس آگهی" },
      { key: "source", label: "منبع", type: "nested", nestedKey: "name" },
      { key: "url", label: "لینک منبع", type: "link", fullWidth: true },
    ],
  },
  {
    section: "status",
    sectionLabel: "وضعیت‌ها",
    fields: [
      {
        key: "status",
        label: "وضعیت آگهی",
        type: "status",
        configKey: "listingStatus",
      },
      {
        key: "review_status",
        label: "وضعیت بررسی",
        type: "status",
        configKey: "listingReviewStatus",
      },
    ],
  },
  {
    section: "pricing",
    sectionLabel: "قیمت و مالی",
    fields: [
      { key: "listed_sale_price", label: "قیمت فروش (منبع)", type: "price" },
      {
        key: "listed_price_per_meter",
        label: "قیمت هر متر (منبع)",
        type: "price",
      },
      { key: "listed_mortgage_amount", label: "رهن (منبع)", type: "price" },
      { key: "listed_deposit_amount", label: "ودیعه (منبع)", type: "price" },
      {
        key: "listed_rent_amount",
        label: "اجاره ماهیانه (منبع)",
        type: "price",
      },
    ],
  },
  {
    section: "physical",
    sectionLabel: "مشخصات فیزیکی",
    fields: [
      {
        key: "listed_area",
        label: "متراژ",
        suffix: " متر مربع",
      },
      {
        key: "build_year",
        label: "سال ساخت",
      },
      {
        key: "room_count",
        label: "تعداد اتاق",
      },
      {
        key: "floor_number",
        label: "طبقه",
      },
      {
        key: "total_floors",
        label: "تعداد طبقات",
      },
      {
        key: "pictures_match_property",
        label: "تطابق تصاویر",
        type: "boolean",
      },
    ],
  },
  {
    section: "stats",
    sectionLabel: "آمار و رسانه",
    fields: [
      { key: "media_count", label: "تعداد رسانه" },
      { key: "views_count", label: "تعداد بازدید" },
      { key: "leads_count", label: "تعداد سرنخ" },
    ],
  },
  {
    section: "scraping",
    sectionLabel: "وضعیت اسکرپینگ",
    fields: [
      { key: "first_seen_at", label: "اولین مشاهده", type: "dateTime" },
      { key: "last_seen_at", label: "آخرین مشاهده", type: "dateTime" },
      { key: "last_checked_at", label: "آخرین بررسی", type: "dateTime" },
      { key: "last_changed_at", label: "آخرین تغییر", type: "dateTime" },
      // { key: "consecutive_failures", label: "تعداد خطای متوالی" },
      { key: "removal_detected_at", label: "زمان حذف از منبع", type: "dateTime" },
      // { key: "content_hash", label: "هش محتوا", type: "mono" },
    ],
  },
  // {
  //   section: "payload",
  //   sectionLabel: "داده خام (Payload)",
  //   fields: [
  //     {
  //       key: "latest_payload",
  //       label: "آخرین payload",
  //       type: "json",
  //       fullWidth: true,
  //     },
  //   ],
  // },
  {
    section: "dates",
    sectionLabel: "تاریخ‌ها",
    fields: [
      { key: "published_at", label: "تاریخ انتشار", type: "dateTime" },
      {
        key: "source_updated_at",
        label: "آخرین بروزرسانی منبع",
        type: "dateTime",
      },
      { key: "expires_at", label: "تاریخ انقضا", type: "dateTime" },
      { key: "created_at", label: "تاریخ ثبت در سیستم", type: "dateTime" },
      { key: "updated_at", label: "آخرین بروزرسانی", type: "dateTime" },
    ],
  },
  {
    section: "description",
    sectionLabel: "توضیحات",
    fields: [{ key: "description", label: "توضیحات آگهی", fullWidth: true }],
  },
];

export const LISTING_SNAPSHOT_COLUMNS = [
  { key: "observed_at", header: "زمان مشاهده", type: "date" },
  // { key: "content_hash", header: "هش محتوا", type: "mono" },
  {
    key: "run",
    header: "اجرا",
    type: "nested",
    nestedKey: "id",
    format: (v) => (v ? String(v).slice(0, 8) + "…" : "—"),
  },
  { key: "changed_fields", header: "فیلدهای تغییرکرده", type: "json_badge" },
];

export const LISTING_TARGET_COLUMNS = [
  { key: "target", header: "تارگت", type: "nested", nestedKey: "name" },
  { key: "first_seen_at", header: "اولین مشاهده", type: "date" },
  { key: "last_seen_at", header: "آخرین مشاهده", type: "date" },
  {
    key: "last_seen_full_discovery_at",
    header: "آخرین کشف کامل",
    type: "date",
  },
  { key: "consecutive_full_absences", header: "غیبت‌های متوالی" },
  { key: "last_card_fingerprint", header: "Fingerprint", type: "mono" },
];

/* ─── Tab 4: Status History (listing.ListingStatusHistory) ─── */
export const LISTING_STATUS_HISTORY_COLUMNS = [
  { key: "old_status", header: "وضعیت قبلی", type: "status", configKey: "listingStatus" },
  { key: "new_status", header: "وضعیت جدید", type: "status", configKey: "listingStatus" },
  { key: "reason", header: "دلیل", type: "text" },
  { key: "changed_by", header: "تغییردهنده", type: "user" },
  { key: "created_at", header: "زمان", type: "date" },
];

/* ─── Tab 5: Property (properties.Property) ───
 */
export const LISTING_PROPERTY_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات ملک نهایی",
    fields: [
      { key: "property_code", label: "کد ملک" },
      { key: "title", label: "عنوان", fullWidth: true },
      { key: "deal_type", label: "نوع معامله", type: "status", configKey: "propertyDealType" },
      { key: "status", label: "وضعیت", type: "status", configKey: "propertyStatus" },
    ],
  },
  {
    section: "pricing",
    sectionLabel: "قیمت نهایی (بعد از بررسی)",
    fields: [
      { key: "sale_price", label: "قیمت فروش نهایی", type: "price" },
      { key: "price_per_meter", label: "قیمت هر متر نهایی", type: "price" },
      { key: "mortgage_amount", label: "رهن نهایی", type: "price" },
      { key: "deposit_amount", label: "ودیعه نهایی", type: "price" },
      { key: "monthly_rent", label: "اجاره نهایی", type: "price" },
    ],
  },
  {
    section: "people",
    sectionLabel: "اشخاص نهایی",
    fields: [
      { key: "owner", label: "مالک", type: "user" },
      { key: "agent", label: "مشاور", type: "user" },
    ],
  },
  {
    section: "link",
    sectionLabel: "",
    fields: [
      { key: "id", label: "", type: "action", action: "navigate_to_property", label: "مشاهده صفحه کامل ملک →" },
    ],
  },
];
