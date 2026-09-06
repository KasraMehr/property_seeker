import {
  Eye, Ban, Trash2, List, AlertTriangle, Play, Download, Pause
} from "lucide-react";

/**
 * ingestionRun Actions Config
 * Backend: ingestion.ingestionRun
 * 
 *  Scraper management is admin/owner-only.
 */

export const SCRAPER_RUN_ROW_ACTIONS = [
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
    key: "view_items",
    label: "مشاهده آیتم‌ها",
    icon: List,
    variant: "ghost",
    type: "row",
    permission: null,
    modal: "items",
  },
  {
    key: "view_errors",
    label: "مشاهده خطاها",
    icon: AlertTriangle,
    variant: "ghost",
    type: "row",
    permission: null,
    condition: (row) => row.failed_count > 0,
    modal: "errors",
  },
  {
  key: "resume",
  label: "ادامه اجرا",
  icon: Play, 
  variant: "primary",
  type: "row",
  condition: (row) => row.status === "failed" || row.status === "cancelled",
  handler: "resume_run",
  confirm: {
    title: "ادامه اجرا",
    message: "آیا از ادامه این اجرا اطمینان دارید؟",
  },
},
  {
    key: "cancel",
    label: "توقف اجرا",
    icon: Ban,
    variant: "outline",
    type: "row",
    condition: (row) => row.status === "queued" || row.status === "running",
    handler: "cancel_run",
    confirm: {
      title: "توقف اجرا",
      message: "آیا از توقف این اجرا اطمینان دارید؟",
    },
  },
  {
    key: "delete",
    label: "حذف اجرا",
    icon: Trash2,
    variant: "danger",
    type: "row",
    condition: (row) => row.status !== "queued" && row.status !== "running",
    handler: "delete_run",
    confirm: {
      title: "حذف اجرا",
      message: "آیا از حذف این اجرا اطمینان دارید؟ این عمل قابل بازگشت نیست.",
    },
  },
];

export const SCRAPER_RUN_BULK_ACTIONS = [
  {
    key: "bulk_toggle",
    label: "توقف / ادامه",
    icon: Pause,
    variant: "outline",
    type: "bulk",
    permission: null,
    handler: "bulk_toggle",
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
      title: "حذف گروهی اجراها",
      message: "آیا از حذف اجراهای انتخاب‌شده اطمینان دارید؟ این عمل قابل بازگشت نیست.",
    },
  },
];

