import {
  Eye, Trash2, Download, Shield
} from "lucide-react";

/**
 * Activity Log Actions Config
 * Backend: audit.ActivityLog
 * 
 *  Admin-only feature. All delete actions restricted.
 */

export const ACTIVITY_LOG_ROW_ACTIONS = [
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
    key: "delete",
    label: "حذف",
    icon: Trash2,
    variant: "ghost",
    type: "row",
    permission: null, // admin-only
    danger: true,
    confirm: {
      title: "حذف لاگ",
      message: "آیا از حذف این رکورد لاگ اطمینان دارید؟",
    },
  },
];

export const ACTIVITY_LOG_BULK_ACTIONS = [
  {
    key: "delete",
    label: "حذف انتخاب‌شده‌ها",
    icon: Trash2,
    variant: "outline",
    type: "bulk",
    permission: null, // admin-only
    danger: true,
    confirm: {
      title: "حذف گروهی لاگ‌ها",
      message: "آیا از حذف لاگ‌های انتخاب‌شده اطمینان دارید؟",
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
    label: "خروجی JSON",
    icon: Download,
    variant: "outline",
    type: "bulk",
    permission: null,
    handler: "export_json",
  },
];

export const ACTIVITY_LOG_ALL_ACTIONS = [...ACTIVITY_LOG_ROW_ACTIONS, ...ACTIVITY_LOG_BULK_ACTIONS];