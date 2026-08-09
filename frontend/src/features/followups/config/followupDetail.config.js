
import {
  Hash, FileText, Tag, Clock, StickyNote, CalendarClock,
  CheckCircle2, Calendar, Home, User, UserCheck, ClipboardList
} from "lucide-react";

/* ─── Tabs ─── */
export const FOLLOWUP_DETAIL_TABS = [
  { key: "details", label: "جزئیات پیگیری", icon: ClipboardList },
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
  property_code: Home,
  customer_name: User,
  user_name: UserCheck,
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
      { key: "customer_name", label: "نام مشتری", condition: (v) => !!v },
      { key: "property_code", label: "کد ملک مرتبط", condition: (v) => !!v },
    ],
  },
  {
    section: "agent",
    sectionLabel: "مسئول",
    fields: [
      { key: "user_name", label: "کارشناس مسئول" },
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