import {
  Hash,
  FileText,
  Tag,
  Clock,
  StickyNote,
  CalendarClock,
  CheckCircle2,
  Calendar,
  Home,
  User,
  Phone,
  UserCheck,
  Building2,
  ClipboardList,
  UserCircle,
  ListTodo,
} from "lucide-react";

/* ─── Tabs ─── */
export const FOLLOWUP_DETAIL_TABS = [
  { key: "details", label: "جزئیات پیگیری", icon: ClipboardList },
  { key: "customer", label: "مشتری و تماس", icon: UserCircle },
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
  customer_phone: Phone,
  user: UserCheck,
  agency: Building2,
  followup_count: ListTodo,
};

/* ─── Tab 1: Followup Details ───
 * dataKey = کلید واقعی داخل آبجکت followup
 * key     = کلید یکتای React (می‌تونه فرق کنه)
 */
export const FOLLOWUP_TAB1_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "id", label: "شناسه", format: (v) => `#${v}` },
      { key: "title", label: "عنوان", fullWidth: true },
      { key: "type", label: "نوع", type: "followupType" },
      { key: "status", label: "وضعیت", type: "status" },
    ],
  },
  {
    section: "dates",
    sectionLabel: "تاریخ‌ها",
    fields: [
      { key: "due_at", label: "تاریخ سررسید", type: "dateTime" },
      { key: "completed_at", label: "تاریخ تکمیل", type: "dateTime" },
      { key: "created_at", label: "تاریخ ثبت", type: "dateTime" },
      { key: "updated_at", label: "آخرین بروزرسانی", type: "dateTime" },
    ],
  },
  {
    section: "related",
    sectionLabel: "اطلاعات مرتبط",
    fields: [
      { key: "property_title", dataKey: "property", label: "ملک مرتبط", type: "nested", nestedKey: "title", fullWidth: true },
      { key: "customer_name", dataKey: "customer", label: "مشتری", type: "nested", nestedKey: "full_name" },
      { key: "customer_phone", dataKey: "customer", label: "شماره تماس", type: "nested", nestedKey: "phone" },
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
export const FOLLOWUP_TAB2_FIELDS = [
  {
    section: "customer",
    sectionLabel: "مشخصات مشتری",
    fields: [
      { key: "cust_name", dataKey: "customer", label: "نام کامل", type: "nested", nestedKey: "full_name", fullWidth: true },
      { key: "cust_phone", dataKey: "customer", label: "شماره تماس", type: "nested", nestedKey: "phone" },
      { key: "cust_alt", dataKey: "customer", label: "شماره جایگزین", type: "nested", nestedKey: "alternate_phone" },
      { key: "cust_nid", dataKey: "customer", label: "کد ملی", type: "nested", nestedKey: "national_id" },
    ],
  },
  {
    section: "agent",
    sectionLabel: "مسئول پیگیری",
    fields: [
      { key: "agent_name", dataKey: "user", label: "کارشناس", type: "nested", nestedKey: "full_name" },
      { key: "agency_name", dataKey: "agency", label: "آژانس", type: "nested", nestedKey: "name" },
    ],
  },
];