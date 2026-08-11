import {
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  Phone,
  Download,
} from "lucide-react";

/**
 * Call Log Actions Config
 * Backend: crm.CallLog
 *
 *  Call permissions not yet defined in backend.
 *    Using null (available to all authenticated) or owner-only for delete.
 */

export const CALL_ROW_ACTIONS = [
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
    key: "mark_follow_up_done",
    label: "پیگیری انجام شد",
    icon: CheckCircle2,
    variant: "outline",
    type: "row",
    permission: null,
    condition: (row) => row.next_follow_up_at && !row.follow_up_done,
    handler: "mark_follow_up_done",
  },
  {
    key: "add_followup",
    label: "ثبت پیگیری جدید",
    icon: Clock,
    variant: "outline",
    type: "row",
    permission: null,
    condition: (row) =>
      row.result === "follow_up" || row.result === "interested",
    modal: "add_followup",
  },
  {
    key: "delete",
    label: "حذف",
    icon: Trash2,
    variant: "ghost",
    type: "row",
    permission: null,
    danger: true,
    condition: (row) => !row.is_deleted,
    handler: "delete",
    confirm: {
      title: "حذف تماس",
      message: "آیا از حذف این رکورد تماس اطمینان دارید؟",
    },
  },
];

export const CALL_BULK_ACTIONS = [
  {
    key: "delete",
    label: "حذف انتخاب‌شده‌ها",
    icon: Trash2,
    variant: "outline",
    type: "bulk",
    permission: null,
    danger: true,
    handler: "bulkDelete", 
    confirm: {
      title: "حذف گروهی",
      message: "آیا از حذف تماس‌های انتخاب‌شده اطمینان دارید؟",
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

export const CALL_ALL_ACTIONS = [...CALL_ROW_ACTIONS, ...CALL_BULK_ACTIONS];
