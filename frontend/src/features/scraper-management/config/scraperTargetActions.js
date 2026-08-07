import {
  Eye, Pencil, Trash2, Play, Pause, Zap, Settings, Download
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
    label: "مشاهده",
    icon: Eye,
    variant: "ghost",
    type: "row",
    permission: null,
    modal: "detail",
  },
  {
    key: "edit",
    label: "ویرایش",
    icon: Pencil,
    variant: "ghost",
    type: "row",
    permission: null, // admin-only
    modal: "edit",
  },
  {
    key: "toggle_enabled",
    label: "فعال/غیرفعال",
    icon: Pause,
    variant: "outline",
    type: "row",
    permission: null,
    condition: (row) => row.enabled,
    handler: "toggle_enabled",
  },
  {
    key: "toggle_enabled_activate",
    label: "فعال‌سازی",
    icon: Play,
    variant: "primary",
    type: "row",
    permission: null,
    condition: (row) => !row.enabled,
    handler: "toggle_enabled",
  },
  {
    key: "trigger_run",
    label: "اجرای فوری",
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
    label: "حذف",
    icon: Trash2,
    variant: "ghost",
    type: "row",
    permission: null, // admin-only
    danger: true,
    confirm: {
      title: "حذف تارگت",
      message: "آیا از حذف این تارگت اسکرپر اطمینان دارید؟",
    },
  },
];

export const SCRAPER_TARGET_BULK_ACTIONS = [
  {
    key: "toggle_enabled",
    label: "فعال/غیرفعال",
    icon: Play,
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
      message: "آیا از اجرای فوری تارگت‌های انتخاب‌شده اطمینان دارید؟",
    },
  },
  {
    key: "delete",
    label: "حذف انتخاب‌شده‌ها",
    icon: Trash2,
    variant: "outline",
    type: "bulk",
    permission: null,
    danger: true,
    confirm: {
      title: "حذف گروهی",
      message: "آیا از حذف تارگت‌های انتخاب‌شده اطمینان دارید؟",
    },
  },
  {
    key: "export",
    label: "خروجی Excel",
    icon: Download,
    variant: "outline",
    type: "bulk",
    permission: null,
    handler: "export",
  },
];

export const SCRAPER_TARGET_ALL_ACTIONS = [...SCRAPER_TARGET_ROW_ACTIONS, ...SCRAPER_TARGET_BULK_ACTIONS];