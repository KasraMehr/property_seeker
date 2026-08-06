import {
  Hash,
  User,
  Phone,
  Fingerprint,
  Shield,
  Building2,
  MapPin,
  CheckCircle2,
  XCircle,
  Crown,
  Calendar,
  StickyNote,
  Home,
  PhoneCall,
  ClipboardList,
  Eye,
  FileText,
  UserPlus,
  Settings,
} from "lucide-react";

/* ─── Tabs ─── */
export const USER_DETAIL_TABS = [
  { key: "profile", label: "مشخصات کاربر", icon: User },
  { key: "activity", label: "تاریخچه فعالیت", icon: Calendar },
];

/* ─── Icon Map ─── */
export const USER_ICON_MAP = {
  id: Hash,
  full_name: User,
  phone: Phone,
  national_id: Fingerprint,
  role: Shield,
  agency: Building2,
  service_neighborhoods: MapPin,
  is_active: CheckCircle2,
  is_owner: Crown,
  is_staff: Settings,
  created_at: Calendar,
  updated_at: Calendar,
  notes: StickyNote,
  property_count: Home,
  call_count: PhoneCall,
  followup_count: ClipboardList,
  listing_count: FileText,
  visit_count: Eye,
};

/* ─── Tab 1: Profile Fields ─── */
export const USER_PROFILE_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "id", label: "شناسه", format: (v) => `#${v}` },
      { key: "full_name", label: "نام کامل", fullWidth: true },
      { key: "phone", label: "شماره تماس", type: "phone" },
      { key: "national_id", label: "کد ملی" },
    ],
  },
  {
    section: "role",
    sectionLabel: "نقش و سازمان",
    fields: [
      { key: "role", label: "نقش", type: "role" },
      { key: "agency", label: "آژانس", type: "nested", nestedKey: "name", fullWidth: true },
    ],
  },
  {
    section: "account",
    sectionLabel: "وضعیت حساب",
    fields: [
      { key: "is_active", label: "وضعیت حساب", type: "boolean" },
      { key: "is_owner", label: "مالک سیستم", type: "boolean" },
      { key: "is_staff", label: "کارمند", type: "boolean" },
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

/* ─── Tab 2: Activity History Types ─── */
export const ACTIVITY_TYPE_CONFIG = {
  property_created: {
    label: "ثبت ملک",
    icon: Home,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  call_made: {
    label: "تماس",
    icon: PhoneCall,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  followup_created: {
    label: "پیگیری",
    icon: ClipboardList,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  listing_viewed: {
    label: "مشاهده آگهی",
    icon: Eye,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  user_assigned: {
    label: "تخصیص کاربر",
    icon: UserPlus,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  login: {
    label: "ورود به سیستم",
    icon: Shield,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
  },
};