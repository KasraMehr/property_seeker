import {
  Hash, FileText, Tag, Clock, StickyNote, CalendarClock,
  CheckCircle2, XCircle, Calendar, Home, User, Phone,
  UserCheck, Building2, ClipboardList, UserCircle, ListTodo,
  RotateCcw, MapPin, FileQuestion
} from "lucide-react";

/**
 * Reminder (Follow-up) Detail Modal Config
 * Backend: crm.Reminder
 * Tabs: details | customer
 */

/* ─── Tabs ─── */
export const FOLLOWUP_DETAIL_TABS = [
  { key: "details", label: "جزئیات پیگیری", icon: ClipboardList },
  { key: "customer", label: "مشتری و تماس", icon: UserCircle, condition: (data) => !!data.customer },
];

/* ─── Icon Map ─── */
export const FOLLOWUP_ICON_MAP = {
  id: Hash,
  title: FileText,
  type: Tag,
  status: Clock,
  description: StickyNote,
  due_at: CalendarClock,
  completed_at: CheckCircle2,
  created_at: Calendar,
  updated_at: Calendar,
  property: Home,
  customer: User,
  user: UserCheck,
  agency: Building2,
};

/* ─── Tab 1: Followup Details ─── */
export const FOLLOWUP_DETAIL_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "id", label: "شناسه", format: (v) => `#${v}` },
      { key: "title", label: "عنوان وظیفه", fullWidth: true },
      { key: "type", label: "نوع", type: "status", configKey: "followupType" },
      { key: "status", label: "وضعیت", type: "status", configKey: "followupStatus" },
    ],
  },
  {
    section: "dates",
    sectionLabel: "تاریخ‌ها",
    fields: [
      { key: "due_at", label: "موعد انجام", type: "dateTime" },
      { key: "completed_at", label: "تاریخ تکمیل", type: "dateTime" },
      { key: "created_at", label: "تاریخ ایجاد", type: "dateTime" },
      { key: "updated_at", label: "آخرین بروزرسانی", type: "dateTime" },
    ],
  },
  {
    section: "related",
    sectionLabel: "اطلاعات مرتبط",
    fields: [
      { key: "property", label: "ملک مرتبط", type: "nested", nestedKey: "property_code", linkTo: "property", fullWidth: true, condition: (v) => !!v },
      { key: "customer", label: "مشتری", type: "nested", nestedKey: "full_name", linkTo: "customer", condition: (v) => !!v },
      { key: "customer_phone", dataKey: "customer", label: "شماره تماس مشتری", type: "nested", nestedKey: "phone", condition: (data) => !!data.customer },
    ],
  },
  {
    section: "agent",
    sectionLabel: "مسئول",
    fields: [
      { key: "user", label: "کارشناس مسئول", type: "user" },
      { key: "agency", label: "آژانس", type: "nested", nestedKey: "name" },
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

/* ─── Tab 2: Customer & Contact ─── */
export const FOLLOWUP_CUSTOMER_FIELDS = [
  {
    section: "customer",
    sectionLabel: "مشخصات مشتری",
    fields: [
      { key: "customer_full_name", dataKey: "customer", label: "نام کامل", type: "nested", nestedKey: "full_name", fullWidth: true },
      { key: "customer_phone", dataKey: "customer", label: "شماره تماس", type: "nested", nestedKey: "phone" },
      { key: "customer_alternate_phone", dataKey: "customer", label: "شماره جایگزین", type: "nested", nestedKey: "alternate_phone" },
      { key: "customer_national_id", dataKey: "customer", label: "کد ملی", type: "nested", nestedKey: "national_id" },
      { key: "customer_email", dataKey: "customer", label: "ایمیل", type: "nested", nestedKey: "email" },
      { key: "customer_type", dataKey: "customer", label: "نوع مشتری", type: "nested", nestedKey: "customer_type" },
      { key: "customer_status", dataKey: "customer", label: "وضعیت مشتری", type: "nested", nestedKey: "status" },
    ],
  },
  {
    section: "preference",
    sectionLabel: "اولویت‌ها",
    fields: [
      { key: "customer_preference", dataKey: "customer", label: "اولویت جستجو", type: "nested", nestedKey: "preferences", fullWidth: true },
    ],
  },
];