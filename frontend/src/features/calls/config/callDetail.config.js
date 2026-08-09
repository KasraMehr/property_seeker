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
  Voicemail,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  CalendarCheck,
  AlertTriangle,
} from "lucide-react";

/**
 * Call Log Detail Modal Config
 * Backend: crm.CallLog
 * Tabs: call | related
 */

/* ─── Tabs ─── */
export const CALL_DETAIL_TABS = [
  { key: "call", label: "مشخصات تماس", icon: Phone },
  { key: "related", label: "اطلاعات مرتبط", icon: User },
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
    section: "people",
    sectionLabel: "اشخاص",
    fields: [
      { key: "customer_name", label: "نام مشتری" },
      { key: "customer_phone", label: "تلفن مشتری" },
      { key: "handled_by_name", label: "اپراتور" },
    ],
  },
  {
    section: "property",
    sectionLabel: "ملک / آگهی مرتبط",
    fields: [
      {
        key: "property_title",
        label: "عنوان ملک",
        fullWidth: true,
        condition: (v) => !!v,
      },
      {
        key: "listing_id",
        label: "شناسه آگهی",
        fullWidth: true,
        condition: (v) => !!v,
      },
    ],
  },
];

/* ─── Tab 2: Related Info ─── */
export const CALL_RELATED_FIELDS = [
  {
    section: "people",
    sectionLabel: "اشخاص",
    fields: [
      { key: "customer", label: "مشتری", type: "user", linkTo: "customer" },
      { key: "handled_by", label: "اپراتور", type: "user" },
    ],
  },
  {
    section: "property",
    sectionLabel: "ملک / آگهی مرتبط",
    fields: [
      {
        key: "property",
        label: "ملک",
        type: "nested",
        nestedKey: "property_code",
        linkTo: "property",
        fullWidth: true,
        condition: (v) => !!v,
      },
      {
        key: "listing",
        label: "آگهی مبدا",
        type: "nested",
        nestedKey: "title",
        linkTo: "listing",
        fullWidth: true,
        condition: (v) => !!v,
      },
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
