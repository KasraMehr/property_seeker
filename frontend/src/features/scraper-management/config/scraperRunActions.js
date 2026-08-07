import {
  Eye, Ban, Trash2, List, AlertTriangle, Download
} from "lucide-react";

/**
 * IngestionRun Actions Config
 * Backend: ingestion.IngestionRun
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
    key: "cancel",
    label: "لغو اجرا",
    icon: Ban,
    variant: "outline",
    type: "row",
    permission: null,
    condition: (row) => row.status === "queued" || row.status === "running",
    handler: "cancel_run",
    confirm: {
      title: "لغو اجرا",
      message: "آیا از لغو این اجرای اسکرپر اطمینان دارید؟",
    },
  },
  {
    key: "delete",
    label: "حذف",
    icon: Trash2,
    variant: "ghost",
    type: "row",
    permission: null,
    danger: true,
    condition: (row) => row.status !== "running",
    confirm: {
      title: "حذف اجرا",
      message: "آیا از حذف این رکورد اجرا اطمینان دارید؟",
    },
  },
];

export const SCRAPER_RUN_BULK_ACTIONS = [
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
      message: "آیا از حذف اجراهای انتخاب‌شده اطمینان دارید؟",
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
  {
    key: "export_json",
    label: "خروجی JSON (گزارش)",
    icon: Download,
    variant: "outline",
    type: "bulk",
    permission: null,
    handler: "export_json",
  },
];

export const SCRAPER_RUN_ALL_ACTIONS = [...SCRAPER_RUN_ROW_ACTIONS, ...SCRAPER_RUN_BULK_ACTIONS];