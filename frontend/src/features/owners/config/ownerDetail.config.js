import {
  Hash,
  User,
  Phone,
  CreditCard,
  StickyNote,
  Home,
  FileText,
  Building,
  DollarSign,
  MapPin,
  Calendar,
  Car,
  Warehouse,
  Compass,
  Wrench,
  CheckCircle2,
  Tag,
} from "lucide-react";

/**
 * Owner Detail Modal Config
 * Backend: properties.OwnerDetailSerializer
 * فیلدهای واقعی:
 * id, full_name, phone, alternate_phone, national_id, notes,
 * properties_count, created_at, updated_at, created_by, properties
 *
 *  created_by در Serializer بدون UserSerializer است → فقط id (PK) برمی‌گردد
 */

/* ─── Icon Map ─── */
export const OWNER_ICON_MAP = {
  id: Hash,
  full_name: User,
  phone: Phone,
  alternate_phone: Phone,
  national_id: CreditCard,
  notes: StickyNote,
  properties_count: Home,
  created_at: Calendar,
  updated_at: Calendar,
  created_by: User,
};

/* ─── Owner Details ─── */
export const OWNER_DETAIL_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات مالک",
    fields: [
      { key: "full_name", label: "نام و نام خانوادگی" },
      { key: "phone", label: "شماره تماس", type: "phone" },
      {
        key: "alternate_phone",
        label: "شماره تماس جایگزین",
        type: "phone",
        condition: (v) => !!v,
      },
      {
        key: "national_id",
        label: "کد ملی",
        type: "mono",
        condition: (v) => !!v,
      },
      { key: "notes", label: "یادداشت", fullWidth: true },
    ],
  },
  {
    section: "properties",
    sectionLabel: "املاک",
    fields: [
      { key: "properties_count", label: "تعداد املاک" },
    ],
  },
  {
    section: "meta",
    sectionLabel: "ثبت‌کننده و تاریخ‌ها",
    fields: [
      {
        key: "created_by",
        label: "ثبت‌کننده",
      },
      { key: "created_at", label: "تاریخ ثبت", type: "date" },
      { key: "updated_at", label: "آخرین بروزرسانی", type: "date" },
    ],
  },
];

/* ─── Owner Properties (لیست املاک داخل detail) ─── */
export const OWNER_PROPERTY_ICON_MAP = {
  id: Hash,
  property_code: Hash,
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

/**
 * ستون‌های جدول املاک مالک
 * مطابق OwnerPropertySerializer در بک‌اند:
 * agent (UserSerializer), address (AddressSerializer), create_by (UserSerializer),
 * agency (string name), + فیلدهای ملک
 */
export const OWNER_PROPERTY_COLUMNS = [
  { key: "property_code", header: "کد ملک", type: "mono" },
  { key: "title", header: "عنوان ملک" },
  { key: "property_type", header: "نوع ملک" },
  {
    key: "deal_type",
    header: "نوع معامله",
    type: "status",
    configKey: "propertyDealType",
  },
  {
    key: "status",
    header: "وضعیت",
    type: "status",
    configKey: "propertyStatus",
  },
  // agent = UserSerializer → آبجکت؛ اگر renderer فقط string می‌خواهد:
  {
    key: "agent",
    header: "مشاور",
    type: "nested",
    nestedKey: "full_name",
  },
  {
    key: "address",
    header: "آدرس",
    type: "nested",
    nestedKey: "full_text",
  },
  { key: "agency", header: "آژانس" }, // string (agency.name)
  {
    key: "create_by",
    header: "ثبت‌کننده",
    type: "nested",
    nestedKey: "full_name",
  },
  { key: "area", header: "متراژ", suffix: " متر مربع" },
  { key: "floor", header: "طبقه" },
  { key: "total_floors", header: "تعداد طبقات" },
  { key: "age", header: "سن بنا", suffix: " سال" },
  { key: "bedrooms", header: "اتاق خواب" },
  { key: "bathrooms", header: "سرویس بهداشتی" },
  { key: "parking_count", header: "پارکینگ" },
  { key: "storage_count", header: "انباری" },
  { key: "orientation", header: "جهت" },
  { key: "condition", header: "وضعیت ساختمان" },
  { key: "price_per_meter", header: "قیمت هر متر", type: "price" },
  { key: "sale_price", header: "قیمت فروش", type: "price" },
  { key: "mortgage_amount", header: "رهن کامل", type: "price" },
  { key: "deposit_amount", header: "ودیعه", type: "price" },
  { key: "monthly_rent", header: "اجاره ماهیانه", type: "price" },
  { key: "description", header: "توضیحات", type: "text_truncate" },
  { key: "created_at", header: "تاریخ ثبت", type: "date" },
  { key: "updated_at", header: "آخرین بروزرسانی", type: "date" },
];