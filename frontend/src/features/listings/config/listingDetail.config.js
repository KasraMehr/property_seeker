import {
  Hash,
  FileText,
  Phone,
  MapPin,
  Calendar,
  User,
  Home,
  DollarSign,
  Image,
  ExternalLink,
  Clock,
  Building,
  StickyNote,
  Briefcase,
  Car,
  Warehouse,
  Compass,
  Wrench,
  CheckCircle,
  XCircle,
  ArrowRightLeft,
  UserPlus,
  MessageSquare,
} from "lucide-react";

/* ─── Tab Definitions ─── */
export const LISTING_DETAIL_TABS = [
  { key: "listing", label: "جزئیات آگهی", icon: FileText },
  { key: "property", label: "جزئیات ملک", icon: Home },
  { key: "owner", label: "جزئیات مالک", icon: User },
  { key: "history", label: "تاریخچه فعالیت", icon: Clock },
];

/* ─── Icon Map ─── */
export const DETAIL_ICON_MAP = {
  id: Hash,
  external_id: Hash,
  title: FileText,
  source: ExternalLink,
  url: ExternalLink,
  status: FileText,
  score: FileText,
  phone: Phone,
  alternate_phone: Phone,
  district: MapPin,
  address: MapPin,
  assigned_to: User,
  agent: User,
  created_by: User,
  owner: User,
  build_year: Calendar,
  created_at: Calendar,
  updated_at: Calendar,
  published_at: Calendar,
  expires_at: Calendar,
  last_call_at: Calendar,
  listed_area: Home,
  area: Home,
  floor: Home,
  floor_number: Home,
  total_floors: Building,
  room_count: Home,
  bedrooms: Home,
  bathrooms: Home,
  parking_count: Car,
  storage_count: Warehouse,
  orientation: Compass,
  condition: Wrench,
  listed_sale_price: DollarSign,
  sale_price: DollarSign,
  listed_rent_amount: DollarSign,
  monthly_rent: DollarSign,
  listed_deposit_amount: DollarSign,
  deposit_amount: DollarSign,
  mortgage_amount: DollarSign,
  price_per_meter_toman: DollarSign,
  price_per_meter: DollarSign,
  media_count: Image,
  views_count: ExternalLink,
  leads_count: User,
  call_count: Phone,
  description: StickyNote,
  notes: StickyNote,
  property_type: Home,
  deal_type: Briefcase,
  property_code: Hash,
  national_id: Hash,
  agency: Building,
  full_name: User,
  converted_to: ArrowRightLeft,
  converted_id: Hash,
  action: CheckCircle,
  old_value: XCircle,
  new_value: CheckCircle,
  changed_by: User,
};

/* ─── Tab 1: Listing Details ─── */
export const LISTING_DETAIL_FIELDS = [
  // Section: Basic Info
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "id", label: "شناسه", format: (v) => `#${v}` },
      { key: "external_id", label: "شناسه خارجی" },
      { key: "title", label: "عنوان", fullWidth: true },
      { key: "phone", label: "شماره تماس", type: "phone" },
    ],
  },
  // Section: Pricing
  {
    section: "pricing",
    sectionLabel: "قیمت و مالی",
    fields: [
      { key: "listed_sale_price", label: "قیمت فروش", type: "price" },
      { key: "listed_rent_amount", label: "اجاره ماهیانه", type: "price" },
      { key: "listed_deposit_amount", label: "ودیعه", type: "price" },
      { key: "listed_area", label: "متراژ", suffix: " متر" },
      { key: "price_per_meter_toman", label: "قیمت هر متر", type: "price" },
    ],
  },
  // Section: Location
  {
    section: "location",
    sectionLabel: "موقعیت",
    fields: [
      { key: "district", label: "منطقه", type: "nested", nestedKey: "name" },
      { key: "address", label: "آدرس", type: "nested", nestedKey: "full_address", fullWidth: true },
    ],
  },
  // Section: Physical
  {
    section: "physical",
    sectionLabel: "مشخصات فیزیکی",
    fields: [
      { key: "build_year", label: "سال ساخت" },
      { key: "room_count", label: "تعداد اتاق" },
      { key: "floor_number", label: "طبقه" },
    ],
  },
  // Section: Stats
  {
    section: "stats",
    sectionLabel: "آمار",
    fields: [
      { key: "media_count", label: "تعداد رسانه" },
      { key: "views_count", label: "بازدید" },
      { key: "leads_count", label: "سرنخ" },
      { key: "call_count", label: "تماس‌ها" },
    ],
  },
  // Section: People
  {
    section: "people",
    sectionLabel: "اشخاص",
    fields: [
      { key: "assigned_to", label: "اختصاص یافته به", type: "user" },
      { key: "created_by", label: "ثبت کننده", type: "user" },
    ],
  },
  // Section: Dates
  {
    section: "dates",
    sectionLabel: "تاریخ‌ها",
    fields: [
      { key: "created_at", label: "تاریخ ثبت", type: "date" },
      { key: "updated_at", label: "آخرین بروزرسانی", type: "date" },
      { key: "published_at", label: "تاریخ انتشار", type: "date" },
      { key: "expires_at", label: "تاریخ انقضا", type: "date" },
      { key: "last_call_at", label: "آخرین تماس", type: "date" },
    ],
  },
  // Section: Description
  {
    section: "description",
    sectionLabel: "توضیحات",
    fields: [
      { key: "description", label: "توضیحات", fullWidth: true },
    ],
  },
  // Section: Conversion
  {
    section: "conversion",
    sectionLabel: "تبدیل",
    fields: [
      { key: "converted_to", label: "تبدیل شده به" },
      { key: "converted_id", label: "شناسه تبدیل" },
    ],
  },
];

/* ─── Tab 2: Property Details ───
 * Rendered from listing.property when available
 */
export const PROPERTY_DETAIL_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "property_code", label: "کد ملک" },
      { key: "title", label: "عنوان", fullWidth: true },
      { key: "property_type", label: "نوع ملک" },
      { key: "deal_type", label: "نوع معامله" },
      { key: "status", label: "وضعیت", type: "status" },
    ],
  },
  {
    section: "pricing",
    sectionLabel: "قیمت و مالی",
    fields: [
      { key: "sale_price", label: "قیمت فروش", type: "price" },
      { key: "monthly_rent", label: "اجاره ماهیانه", type: "price" },
      { key: "deposit_amount", label: "ودیعه", type: "price" },
      { key: "mortgage_amount", label: "رهن کامل", type: "price" },
      { key: "price_per_meter", label: "قیمت هر متر", type: "price" },
    ],
  },
  {
    section: "location",
    sectionLabel: "موقعیت",
    fields: [
      { key: "area", label: "متراژ", suffix: " متر" },
      { key: "address", label: "آدرس", type: "nested", nestedKey: "full_address", fullWidth: true },
    ],
  },
  {
    section: "physical",
    sectionLabel: "مشخصات فیزیکی",
    fields: [
      { key: "age", label: "سن بنا" },
      { key: "bedrooms", label: "اتاق خواب" },
      { key: "bathrooms", label: "سرویس بهداشتی" },
      { key: "floor", label: "طبقه" },
      { key: "total_floors", label: "تعداد طبقات" },
      { key: "parking_count", label: "پارکینگ" },
      { key: "storage_count", label: "انباری" },
      { key: "orientation", label: "جهت" },
      { key: "condition", label: "وضعیت ساختمان" },
    ],
  },
  {
    section: "people",
    sectionLabel: "اشخاص",
    fields: [
      { key: "owner", label: "مالک", type: "user" },
      { key: "agent", label: "کارشناس", type: "user" },
    ],
  },
  {
    section: "description",
    sectionLabel: "توضیحات",
    fields: [
      { key: "description", label: "توضیحات", fullWidth: true },
    ],
  },
  {
    section: "dates",
    sectionLabel: "تاریخ‌ها",
    fields: [
      { key: "created_at", label: "تاریخ ثبت", type: "date" },
      { key: "updated_at", label: "آخرین بروزرسانی", type: "date" },
    ],
  },
];

/* ─── Tab 3: Owner Details ───
 * Rendered from listing.property?.owner or listing.owner_data
 */
export const OWNER_DETAIL_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "full_name", label: "نام کامل", fullWidth: true },
      { key: "phone", label: "شماره تماس", type: "phone" },
      { key: "alternate_phone", label: "شماره جایگزین", type: "phone" },
      { key: "national_id", label: "کد ملی" },
    ],
  },
  {
    section: "agency",
    sectionLabel: "آژانس",
    fields: [
      { key: "agency", label: "آژانس", type: "nested", nestedKey: "name" },
      { key: "created_by", label: "ثبت کننده", type: "user" },
    ],
  },
  {
    section: "notes",
    sectionLabel: "یادداشت",
    fields: [
      { key: "notes", label: "یادداشت‌ها", fullWidth: true },
    ],
  },
  {
    section: "dates",
    sectionLabel: "تاریخ‌ها",
    fields: [
      { key: "created_at", label: "تاریخ ثبت", type: "date" },
      { key: "updated_at", label: "آخرین بروزرسانی", type: "date" },
    ],
  },
];

/* ─── Tab 4: Activity History ───
 * This is a list renderer, not a field grid.
 * Each entry in the list has this shape:
 */
export const HISTORY_TYPES = {
  CALL: {
    label: "تماس",
    icon: Phone,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  ASSIGNMENT: {
    label: "تخصیص",
    icon: UserPlus,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  STATUS_CHANGE: {
    label: "تغییر وضعیت",
    icon: ArrowRightLeft,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  CONVERSION: {
    label: "تبدیل",
    icon: CheckCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  NOTE: {
    label: "یادداشت",
    icon: MessageSquare,
    color: "text-neutral-500",
    bg: "bg-neutral-500/10",
  },
};