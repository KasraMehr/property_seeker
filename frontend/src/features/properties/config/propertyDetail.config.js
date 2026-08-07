import {
  Hash, FileText, Home, Building, DollarSign, MapPin, Calendar,
  User, Car, Warehouse, Compass, Wrench, StickyNote, CheckCircle2,
  XCircle, Clock, History, Image, Star, Tag, Link2
} from "lucide-react";

/**
 * Property Detail Modal Config
 * Backend: properties.Property + properties.PropertyStatusHistory + properties.PropertyHistory + properties.PropertyFeature
 * Tabs: details | status_history | change_history | features | media
 */

/* ─── Tabs ─── */
export const PROPERTY_DETAIL_TABS = [
  { key: "details", label: "مشخصات ملک", icon: Home },
  { key: "status_history", label: "تاریخچه وضعیت", icon: Clock },
  { key: "change_history", label: "تاریخچه تغییرات", icon: History, permission: "view_property_status_history" },
  { key: "features", label: "امکانات", icon: Star },
  { key: "media", label: "رسانه", icon: Image },
];

/* ─── Icon Map ─── */
export const PROPERTY_ICON_MAP = {
  id: Hash,
  property_code: Hash,
  title: FileText,
  property_type: Home,
  deal_type: Tag,
  status: CheckCircle2,
  area: Home,
  sale_price: DollarSign,
  monthly_rent: DollarSign,
  deposit_amount: DollarSign,
  mortgage_amount: DollarSign,
  price_per_meter: DollarSign,
  age: Calendar,
  bedrooms: Home,
  bathrooms: Home,
  floor: Home,
  total_floors: Building,
  parking_count: Car,
  storage_count: Warehouse,
  orientation: Compass,
  condition: Wrench,
  address: MapPin,
  description: StickyNote,
  notes: StickyNote,
  owner: User,
  agent: User,
  create_by: User,
  created_at: Calendar,
  updated_at: Calendar,
  feature: Star,
};

/* ─── Tab 1: Property Details ─── */
export const PROPERTY_DETAIL_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "property_code", label: "کد ملک", type: "mono" },
      { key: "title", label: "عنوان ملک", fullWidth: true },
      { key: "property_type", label: "نوع ملک" },
      { key: "deal_type", label: "نوع معامله", type: "status", configKey: "propertyDealType" },
      { key: "status", label: "وضعیت", type: "status", configKey: "propertyStatus" },
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
      { key: "area", label: "متراژ", suffix: " متر مربع" },
      { key: "address", label: "آدرس", type: "nested", nestedKey: "full_text", fullWidth: true },
      { key: "address.latitude", label: "عرض جغرافیایی", type: "nested", nestedKey: "latitude" },
      { key: "address.longitude", label: "طول جغرافیایی", type: "nested", nestedKey: "longitude" },
    ],
  },
  {
    section: "physical",
    sectionLabel: "مشخصات فیزیکی",
    fields: [
      { key: "age", label: "سن بنا", suffix: " سال" },
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
      { key: "owner", label: "مالک", type: "user", linkTo: "owner" },
      { key: "agent", label: "مشاور", type: "user" },
      { key: "create_by", label: "ثبت‌کننده", type: "user" },
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
  {
    section: "description",
    sectionLabel: "توضیحات",
    fields: [
      { key: "description", label: "توضیحات", fullWidth: true },
    ],
  },
];

/* ─── Tab 2: Status History (properties.PropertyStatusHistory) ─── */
export const PROPERTY_STATUS_HISTORY_COLUMNS = [
  { key: "old_status", header: "وضعیت قبلی", type: "status", configKey: "propertyStatus" },
  { key: "new_status", header: "وضعیت جدید", type: "status", configKey: "propertyStatus" },
  { key: "changed_by", header: "تغییردهنده", type: "user" },
  { key: "created_at", header: "زمان", type: "date" },
];

/* ─── Tab 3: Change History (properties.PropertyHistory) ─── */
export const PROPERTY_CHANGE_HISTORY_COLUMNS = [
  { key: "action", header: "عملیات", type: "badge", map: { create: "ایجاد", update: "ویرایش", delete: "حذف" } },
  { key: "field_name", header: "فیلد" },
  { key: "old_value", header: "مقدار قدیم", type: "text_truncate" },
  { key: "new_value", header: "مقدار جدید", type: "text_truncate" },
  { key: "changed_by", header: "تغییردهنده", type: "user" },
  { key: "created_at", header: "زمان", type: "date" },
];

/* ─── Tab 4: Features (properties.PropertyFeature M2M) ─── */
export const PROPERTY_FEATURE_COLUMNS = [
  { key: "feature", header: "امکان", type: "nested", nestedKey: "title" },
];

/* ─── Tab 5: Media (media.Media) ───
 * فعلاً placeholder — وقتی media اپ merge شد پر می‌شه
 */
export const PROPERTY_MEDIA_COLUMNS = [
  { key: "file", header: "فایل", type: "image" },
  { key: "media_type", header: "نوع", type: "status", configKey: "mediaType" },
  { key: "is_main", header: "اصلی", type: "boolean" },
  { key: "sort_order", header: "ترتیب" },
  { key: "uploaded_by", header: "آپلودکننده", type: "user" },
  { key: "created_at", header: "تاریخ", type: "date" },
];