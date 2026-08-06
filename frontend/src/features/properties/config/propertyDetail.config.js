import {
  Hash,
  FileText,
  Phone,
  MapPin,
  Calendar,
  User,
  Home,
  DollarSign,
  Building,
  Car,
  Warehouse,
  Compass,
  Wrench,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  StickyNote,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Voicemail,
  Users,
  MessageSquare,
} from "lucide-react";

/* ─── Tabs ─── */
export const PROPERTY_DETAIL_TABS = [
  { key: "property", label: "مشخصات ملک", icon: Home },
  { key: "owner", label: "مشخصات مالک", icon: User },
  { key: "calls", label: "تاریخچه تماس‌ها", icon: Phone },
  { key: "followups", label: "تاریخچه پیگیری‌ها", icon: Clock },
];

/* ─── Icon Map ─── */
export const PROPERTY_ICON_MAP = {
  id: Hash,
  property_code: Hash,
  title: FileText,
  property_type: Home,
  deal_type: Briefcase,
  status: FileText,
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
  district: MapPin,
  description: StickyNote,
  notes: StickyNote,
  owner: User,
  agent: User,
  created_by: User,
  created_at: Calendar,
  updated_at: Calendar,
  full_name: User,
  phone: Phone,
  alternate_phone: Phone,
  national_id: Hash,
  agency: Building,
};

/* ─── Tab 1: Property Fields ─── */
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
      { key: "district", label: "منطقه", type: "nested", nestedKey: "name" },
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
      { key: "created_by", label: "ثبت کننده", type: "user" },
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

/* ─── Tab 2: Owner Fields ─── */
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

/* ─── Tab 3: Call History Types ─── */
export const CALL_TYPE_CONFIG = {
  incoming: { label: "ورودی", icon: PhoneIncoming, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  outgoing: { label: "خروجی", icon: PhoneOutgoing, color: "text-sky-500", bg: "bg-sky-500/10" },
  missed: { label: "بی‌پاسخ", icon: PhoneMissed, color: "text-rose-500", bg: "bg-rose-500/10" },
};

export const CALL_STATUS_CONFIG = {
  completed: { label: "انجام شد", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  scheduled: { label: "زمان‌بندی شده", color: "text-amber-500", bg: "bg-amber-500/10" },
  no_answer: { label: "بی‌پاسخ", color: "text-rose-500", bg: "bg-rose-500/10" },
  voicemail: { label: "صندوق صوتی", icon: Voicemail, color: "text-violet-500", bg: "bg-violet-500/10" },
};

/* ─── Tab 4: Followup History Types ─── */
export const FOLLOWUP_TYPE_CONFIG = {
  call: { label: "تماس", icon: Phone, color: "text-sky-500", bg: "bg-sky-500/10" },
  visit: { label: "بازدید", icon: MapPin, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  meeting: { label: "جلسه", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
  contract: { label: "قرارداد", icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
};

export const FOLLOWUP_STATUS_CONFIG = {
  pending: { label: "در انتظار", color: "text-amber-500", bg: "bg-amber-500/10" },
  completed: { label: "انجام شد", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  cancelled: { label: "لغو شده", color: "text-rose-500", bg: "bg-rose-500/10" },
};