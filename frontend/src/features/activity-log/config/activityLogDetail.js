import {
  Hash,
  Globe,
  AlertTriangle,
  CheckCircle2,
  User,
  FileText,
  Zap,
  Code,
  MapPin,
  Clock3,
  Calendar,
  Activity,
} from "lucide-react";

/**
 * ActivityLog Detail Modal Config
 * Backend: audit.ActivityLog
 * Tabs: details | request | data_diff (admin only)
 */

/* ─── Tabs ─── */
export const ACTIVITY_LOG_DETAIL_TABS = [
  { key: "details", label: "جزئیات لاگ", icon: Activity },
  { key: "request", label: "درخواست", icon: Code, permission: "view_property_status_history" },
  { key: "data_diff", label: "تغییرات داده", icon: FileText, permission: "view_property_status_history" },
];

/* ─── Icon Map ─── */
export const ACTIVITY_LOG_ICON_MAP = {
  id: Hash,
  request_id: Hash,
  action: Zap,
  source: Globe,
  level: AlertTriangle,
  outcome: CheckCircle2,
  user: User,
  entity_type: FileText,
  entity_id: Hash,
  message: FileText,
  request_method: Code,
  request_path: MapPin,
  status_code: Code,
  duration_ms: Clock3,
  ip_address: MapPin,
  user_agent: Globe,
  created_at: Calendar,
  old_data: FileText,
  new_data: FileText,
};

/* ─── Tab 1: Log Details ─── */
export const ACTIVITY_LOG_DETAIL_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "id", label: "شناسه لاگ", format: (v) => `#${v}` },
      { key: "request_id", label: "شناسه درخواست", type: "mono" },
      { key: "action", label: "عملیات", type: "status", configKey: "activityLogAction" },
      { key: "source", label: "منبع", type: "status", configKey: "activityLogSource" },
      { key: "level", label: "سطح", type: "status", configKey: "activityLogLevel" },
      { key: "outcome", label: "نتیجه", type: "status", configKey: "activityLogOutcome" },
    ],
  },
  {
    section: "entity",
    sectionLabel: "موجودیت هدف",
    fields: [
      { key: "entity_type", label: "نوع موجودیت" },
      { key: "entity_id", label: "شناسه موجودیت", type: "mono" },
      { key: "user", label: "کاربر", type: "user" },
    ],
  },
  {
    section: "message",
    sectionLabel: "پیام",
    fields: [
      { key: "message", label: "پیام", fullWidth: true },
      { key: "error_trace", label: "تریس خطا", type: "code", fullWidth: true, condition: (v) => !!v },
    ],
  },
  {
    section: "dates",
    sectionLabel: "تاریخ",
    fields: [
      { key: "created_at", label: "زمان ثبت", type: "dateTime" },
    ],
  },
];

/* ─── Tab 2: Request Details ─── */
export const ACTIVITY_LOG_REQUEST_FIELDS = [
  {
    section: "request",
    sectionLabel: "جزئیات درخواست",
    fields: [
      { key: "request_method", label: "متد" },
      { key: "request_path", label: "مسیر", fullWidth: true },
      { key: "status_code", label: "کد وضعیت" },
      { key: "duration_ms", label: "مدت اجرا (ms)", suffix: " ms" },
      { key: "ip_address", label: "IP آدرس", type: "mono" },
      { key: "user_agent", label: "User Agent", fullWidth: true, type: "text_truncate" },
    ],
  },
  {
    section: "params",
    sectionLabel: "پارامترها",
    fields: [
      { key: "query_params", label: "Query Params", type: "json", fullWidth: true },
    ],
  },
];

/* ─── Tab 3: Data Diff ─── */
export const ACTIVITY_LOG_DATA_DIFF_FIELDS = [
  {
    section: "old",
    sectionLabel: "داده قدیم",
    fields: [
      { key: "old_data", label: "Old Data", type: "json", fullWidth: true },
    ],
  },
  {
    section: "new",
    sectionLabel: "داده جدید",
    fields: [
      { key: "new_data", label: "New Data", type: "json", fullWidth: true },
    ],
  },
];