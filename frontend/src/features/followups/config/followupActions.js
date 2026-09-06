import {
  Eye, Pencil, Trash2, CheckCircle2, XCircle, UserCheck
} from "lucide-react";

/**
 * Reminder (Follow-up) Actions Config
 * Backend: crm.Reminder
 */

export const FOLLOWUP_ROW_ACTIONS = [
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
    permission: null,
    condition: (row) => row.status === "pending",
    modal: "edit",
  },
  {
    key: "mark_done",
    label: "انجام شد",
    icon: CheckCircle2,
    variant: "primary",
    type: "row",
    permission: null,
    condition: (row) => row.status === "pending",
    handler: "mark_done",
  },
  {
    key: "mark_canceled",
    label: "لغو",
    icon: XCircle,
    variant: "outline",
    type: "row",
    permission: null,
    condition: (row) => row.status === "pending",
    danger: true,
    handler: "mark_canceled",
    confirm: {
      title: "لغو پیگیری",
      message: "آیا از لغو این پیگیری اطمینان دارید؟",
    },
  },
  {
    key: "reassign",
    label: "تغییر مسئول",
    icon: UserCheck,
    variant: "ghost",
    type: "row",
    permission: null,
    condition: (row) => row.status === "pending",
    modal: "reassign",
  },
  {
    key: "delete",
    label: "حذف",
    icon: Trash2,
    variant: "ghost",
    type: "row",
    permission: null,
    danger: true,
    confirm: {
      title: "حذف پیگیری",
      message: "آیا از حذف این پیگیری اطمینان دارید؟",
    },
  },
];

export const FOLLOWUP_BULK_ACTIONS = [
  {
    key: "delete",
    label: "حذف انتخاب‌شده‌ها",
    icon: Trash2,
    variant: "danger",
    type: "bulk",
    permission: null,
    danger: true,
  },
];

export const FOLLOWUP_ALL_ACTIONS = [...FOLLOWUP_ROW_ACTIONS, ...FOLLOWUP_BULK_ACTIONS];