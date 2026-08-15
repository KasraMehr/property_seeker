import {
  Hash,
  User,
  Phone,
  Fingerprint,
  Shield,
  Building2,
  MapPin,
  CheckCircle2,
  Crown,
  Calendar,
} from "lucide-react";

/**
 * User Detail Modal Config
 * Backend: accounts.UserSerializer
 * id, full_name, phone, national_id, agency, role,
 * service_neighborhoods, is_owner, is_active, created_at, updated_at
 */

/* ─── Tabs ─── */
export const USER_DETAIL_TABS = [
  { key: "profile", label: "مشخصات کاربر", icon: User },
  {
    key: "activity",
    label: "تاریخچه فعالیت",
    icon: Calendar,
    permission: "view_property_status_history",
  },
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
  created_at: Calendar,
  updated_at: Calendar,
};

/* ─── Tab 1: Profile ─── */
export const USER_PROFILE_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "id", label: "شناسه", format: (v) => `#${v}` },
      { key: "full_name", label: "نام کامل", fullWidth: true },
      { key: "phone", label: "شماره تماس", type: "phone" },
      { key: "national_id", label: "کد ملی", type: "mono" },
    ],
  },
  {
    section: "role",
    sectionLabel: "نقش و سازمان",
    fields: [
      { key: "role", label: "نقش(ها)", type: "role_list" },
      {
        key: "agency",
        label: "آژانس",
        type: "nested",
        nestedKey: "name",
        fullWidth: true,
      },
    ],
  },
  {
    section: "access",
    sectionLabel: "دسترسی‌ها",
    fields: [
      {
        key: "is_active",
        label: "وضعیت حساب",
        type: "boolean",
        trueLabel: "فعال",
        falseLabel: "غیرفعال",
      },
      {
        key: "is_owner",
        label: "مالک آژانس",
        type: "boolean",
        trueLabel: "بله",
        falseLabel: "خیر",
      },
    ],
  },
  {
    section: "service_area",
    sectionLabel: "محله‌های سرویس",
    fields: [
      {
        key: "service_neighborhoods",
        label: "محله‌ها",
        type: "tag_list",
        fullWidth: true,
      },
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

/* ─── Tab 2: Activity History (audit.ActivityLog) ─── */
export const USER_ACTIVITY_COLUMNS = [
  {
    key: "action",
    header: "عملیات",
    type: "status",
    configKey: "activityLogAction",
  },
  {
    key: "source",
    header: "منبع",
    type: "status",
    configKey: "activityLogSource",
  },
  {
    key: "level",
    header: "سطح",
    type: "status",
    configKey: "activityLogLevel",
  },
  {
    key: "outcome",
    header: "نتیجه",
    type: "status",
    configKey: "activityLogOutcome",
  },
  { key: "entity_type", header: "موجودیت" },
  { key: "message", header: "پیام", type: "text_truncate" },
  { key: "created_at", header: "زمان", type: "date" },
];