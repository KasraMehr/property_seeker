import {
  Eye,
  Pencil,
  Trash2,
  Play,
  Pause,
  Zap,
  Settings,
  Download,
  Ban,
} from "lucide-react";

/**
 * ScrapeTarget Actions Config
 * Backend: ingestion.ScrapeTarget
 *
 * Scraper management is admin/owner-only.
 */

export const SCRAPER_TARGET_ROW_ACTIONS = [
  {
    key: "view",
    label: "مشاهده جزئیات",
    icon: Eye,
    variant: "ghost",
    type: "row",
    permission: null,
    modal: "detail",
  },
  {
    key: "edit",
    label: "ویرایش تارگت",
    icon: Pencil,
    variant: "ghost",
    type: "row",
    permission: null,
    modal: "edit",
  },
  {
    key: "toggle_enabled",
    label: "توقف (غیرفعال)",
    icon: Pause,
    variant: "outline",
    type: "row",
    permission: null,
    condition: (row) => row.enabled,
    handler: "toggle_enabled",
  },
  {
    key: "toggle_enabled_activate",
    label: "فعال‌سازی مجدد",
    icon: Play,
    variant: "primary",
    type: "row",
    permission: null,
    condition: (row) => !row.enabled,
    handler: "toggle_enabled",
  },
  {
    key: "trigger_run",
    label: "استخراج / اجرای فوری",
    icon: Zap,
    variant: "outline",
    type: "row",
    permission: null,
    condition: (row) => row.enabled,
    handler: "trigger_run",
    confirm: {
      title: "اجرای اسکرپر",
      message: "آیا از اجرای فوری این تارگت اطمینان دارید؟",
    },
  },
  {
    key: "delete",
    label: "حذف تارگت",
    icon: Trash2,
    variant: "danger",
    type: "row",
    permission: null,
    handler: "delete",
    confirm: {
      title: "حذف تارگت",
      message: "آیا از حذف این تارگت اطمینان دارید؟ این عمل قابل بازگشت نیست.",
    },
  },
];

export const SCRAPER_TARGET_BULK_ACTIONS = [
  {
    key: "toggle_enabled",
    label: "فعال / غیرفعال",
    icon: Pause,
    variant: "outline",
    type: "bulk",
    permission: null,
    handler: "toggle_enabled",
  },
  {
    key: "trigger_run",
    label: "اجرای فوری",
    icon: Zap,
    variant: "outline",
    type: "bulk",
    permission: null,
    handler: "trigger_run",
    confirm: {
      title: "اجرای گروهی",
      message: "مودال اجرا برای اولین تارگت فعال انتخاب‌شده باز می‌شود.",
    },
  },
  {
    key: "bulk_delete",
    label: "حذف گروهی",
    icon: Trash2,
    variant: "danger",
    type: "bulk",
    permission: null,
    handler: "bulk_delete",
    confirm: {
      title: "حذف گروهی تارگت‌ها",
      message: "آیا از حذف تارگت‌های انتخاب‌شده اطمینان دارید؟ این عمل قابل بازگشت نیست.",
    },
  },
];

export const SCRAPER_TARGET_ALL_ACTIONS = [
  ...SCRAPER_TARGET_ROW_ACTIONS,
  ...SCRAPER_TARGET_BULK_ACTIONS,
];
