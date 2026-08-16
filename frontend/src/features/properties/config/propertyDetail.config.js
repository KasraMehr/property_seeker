import {
  Hash,
  FileText,
  Home,
  Building,
  DollarSign,
  MapPin,
  Calendar,
  User,
  Car,
  Warehouse,
  Compass,
  Wrench,
  StickyNote,
  CheckCircle2,
  Clock,
  History,
  Image,
  Star,
  Tag,
} from "lucide-react";

/* ─── Tabs ─── */
export const PROPERTY_DETAIL_TABS = [
  { key: "details", label: "مشخصات ملک", icon: Home },
  { key: "status_history", label: "تاریخچه وضعیت", icon: Clock },
  {
    key: "change_history",
    label: "تاریخچه تغییرات",
    icon: History,
    permission: "view_property_status_history",
  },
  { key: "features", label: "امکانات", icon: Star },
  { key: "media", label: "رسانه", icon: Image },
];

/* ─── Icon Map ─── */
export const PROPERTY_ICON_MAP = {
  id: Hash,
  property_code: Hash,
  owner: User,
  phone: User,
  agent: User,
  address: MapPin,
  agency: Building,
  create_by: User,
  title: FileText,
  property_type: Home,
  deal_type: Tag,
  area: Home,
  floor: Home,
  total_floors: Building,
  age: Calendar,
  bedrooms: Home,
  bathrooms: Home,
  parking_count: Car,
  storage_count: Warehouse,
  orientation: Compass,
  condition: Wrench,
  description: StickyNote,
  price_per_meter: DollarSign,
  sale_price: DollarSign,
  mortgage_amount: DollarSign,
  deposit_amount: DollarSign,
  monthly_rent: DollarSign,
  status: CheckCircle2,
  created_at: Calendar,
  updated_at: Calendar,
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
      {
        key: "deal_type",
        label: "نوع معامله",
        type: "status",
        configKey: "propertyDealType",
      },
      {
        key: "status",
        label: "وضعیت",
        type: "status",
        configKey: "propertyStatus",
      },
    ],
  },
  {
    section: "pricing",
    sectionLabel: "قیمت و مالی",
    fields: [
      { key: "price_per_meter", label: "قیمت هر متر", type: "price" },
      { key: "sale_price", label: "قیمت فروش", type: "price" },
      { key: "mortgage_amount", label: "رهن کامل", type: "price" },
      { key: "deposit_amount", label: "ودیعه", type: "price" },
      { key: "monthly_rent", label: "اجاره ماهیانه", type: "price" },
    ],
  },
  {
    section: "location",
    sectionLabel: "موقعیت",
    fields: [
      { key: "area", label: "متراژ", suffix: " متر مربع" },
      {
        key: "address",
        label: "استان",
        type: "nested",
        nestedKey: "province_name",
      },
      { key: "address", label: "شهر", type: "nested", nestedKey: "city_name" },
      {
        key: "address",
        label: "منطقه",
        type: "nested",
        nestedKey: "district_name",
      },
      {
        key: "address",
        label: "محله",
        type: "nested",
        nestedKey: "neighborhood_name",
      },
      {
        key: "address",
        label: "آدرس کامل",
        type: "nested",
        nestedKey: "full_text",
        fullWidth: true,
      },
    ],
  },
  {
    section: "physical",
    sectionLabel: "مشخصات فیزیکی",
    fields: [
      { key: "floor", label: "طبقه" },
      { key: "total_floors", label: "تعداد طبقات" },
      { key: "age", label: "سن بنا", suffix: " سال" },
      { key: "bedrooms", label: "اتاق خواب" },
      { key: "bathrooms", label: "سرویس بهداشتی" },
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
      { key: "owner", label: "مالک", type: "text" },
      { key: "phone", label: "تلفن مالک" },
      { key: "agent", label: "مشاور", type: "user" },
      { key: "create_by", label: "ثبت‌کننده", type: "user" },
      { key: "agency", label: "آژانس" },
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
    fields: [{ key: "description", label: "توضیحات", fullWidth: true }],
  },
];

/* ─── Tab 2: Status History ─── */
export const PROPERTY_STATUS_HISTORY_COLUMNS = [
  {
    key: "old_status",
    header: "وضعیت قبلی",
    type: "status",
    configKey: "propertyStatus",
  },
  {
    key: "new_status",
    header: "وضعیت جدید",
    type: "status",
    configKey: "propertyStatus",
  },
  { key: "changed_by", header: "تغییردهنده", type: "user" },
  { key: "created_at", header: "زمان", type: "date" },
];

/* ─── Tab 3: Change History ─── */
export const PROPERTY_CHANGE_HISTORY_COLUMNS = [
  {
    key: "action",
    header: "عملیات",
    type: "badge",
    map: { create: "ایجاد", update: "ویرایش", delete: "حذف" },
  },
  { key: "field_name", header: "فیلد" },
  { key: "old_value", header: "مقدار قدیم", type: "text_truncate" },
  { key: "new_value", header: "مقدار جدید", type: "text_truncate" },
  { key: "changed_by", header: "تغییردهنده", type: "user" },
  { key: "created_at", header: "زمان", type: "date" },
];

/* ─── Tab 4: Features ─── */
export const PROPERTY_FEATURE_COLUMNS = [
  { key: "feature_id", header: "امکان", type: "nested", nestedKey: "title" },
];

/* ─── Tab 5: Media ─── */
export const PROPERTY_MEDIA_COLUMNS = [
  { key: "file", header: "فایل", type: "image" },
  { key: "media_type", header: "نوع", type: "status", configKey: "mediaType" },
  { key: "is_main", header: "اصلی", type: "boolean" },
  { key: "sort_order", header: "ترتیب" },
  { key: "uploaded_by", header: "آپلودکننده", type: "user" },
  { key: "created_at", header: "تاریخ", type: "date" },
];
