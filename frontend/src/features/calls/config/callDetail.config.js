import {
  Hash,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  User,
  Home,
  FileText,
  Building,
  StickyNote,
  Mic,
  Play,
  Download,
} from "lucide-react";

/* ─── Tabs ─── */
export const CALL_DETAIL_TABS = [
  { key: "call", label: "مشخصات تماس", icon: Phone },
  { key: "related", label: "اطلاعات مرتبط", icon: User },
  { key: "record", label: "فایل صوتی", icon: Mic },
];

/* ─── Icon Map ─── */
export const CALL_ICON_MAP = {
  id: Hash,
  call_type: Phone,
  result: CheckCircle2,
  call_duration: Clock,
  note: StickyNote,
  called_at: Calendar,
  next_follow_up_at: Calendar,
  follow_up_done: CheckCircle2,
  record_file: Mic,
  customer: User,
  property: Home,
  listing: FileText,
  handled_by: User,
  agency: Building,
};

/* ─── Tab 1: Call Info ─── */
export const CALL_DETAIL_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "id", label: "شناسه تماس", format: (v) => `#${v}` },
      { key: "call_type", label: "نوع تماس", type: "callType" },
      { key: "result", label: "نتیجه", type: "result" },
      { key: "call_duration", label: "مدت تماس", type: "duration" },
    ],
  },
  {
    section: "followup",
    sectionLabel: "پیگیری",
    fields: [
      { key: "next_follow_up_at", label: "پیگیری بعدی", type: "date" },
      { key: "follow_up_done", label: "وضعیت پیگیری", type: "boolean" },
    ],
  },
  {
    section: "note",
    sectionLabel: "یادداشت",
    fields: [
      { key: "note", label: "یادداشت", fullWidth: true },
    ],
  },
  {
    section: "dates",
    sectionLabel: "تاریخ‌ها",
    fields: [
      { key: "called_at", label: "زمان تماس", type: "dateTime" },
      { key: "created_at", label: "تاریخ ثبت", type: "dateTime" },
    ],
  },
];

/* ─── Tab 2: Related Info ─── */
export const CALL_RELATED_FIELDS = [
  {
    section: "people",
    sectionLabel: "اشخاص",
    fields: [
      { key: "customer", label: "مشتری", type: "user" },
      { key: "handled_by", label: "اپراتور", type: "user" },
    ],
  },
  {
    section: "property",
    sectionLabel: "ملک / آگهی",
    fields: [
      { key: "property", label: "ملک", type: "nested", nestedKey: "title", fullWidth: true },
      { key: "listing", label: "آگهی مبدا", type: "nested", nestedKey: "title", fullWidth: true },
    ],
  },
  {
    section: "agency",
    sectionLabel: "آژانس",
    fields: [
      { key: "agency", label: "آژانس", type: "nested", nestedKey: "name" },
    ],
  },
];