import {
  Eye, Pencil, Trash2, ShieldCheck, ShieldX, Lock, UserPlus,
  KeyRound, Download, Ban
} from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";

/**
 * User Actions Config
 * Backend: accounts.User
 * 
 *  User management is owner-only in backend (IsAgencyOwner).
 *    Using OWNER_ONLY_SECTIONS logic + is_owner/is_superuser bypass.
 */

export const USER_ROW_ACTIONS = [
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
    permission: null, // owner-only section
    modal: "edit",
  },
  {
    key: "toggle_active",
    label: "فعال/غیرفعال",
    icon: ShieldX,
    variant: "ghost",
    type: "row",
    permission: null, // owner-only
    condition: (row) => row.is_active,
    handler: "toggle_active",
    confirm: {
      title: "غیرفعال‌سازی",
      message: "آیا از غیرفعال کردن این کاربر اطمینان دارید؟",
    },
  },
  {
    key: "toggle_active_enable",
    label: "فعال‌سازی",
    icon: ShieldCheck,
    variant: "ghost",
    type: "row",
    permission: null,
    condition: (row) => !row.is_active,
    handler: "toggle_active",
  },
  {
    key: "delete",
    label: "حذف",
    icon: Trash2,
    variant: "ghost",
    type: "row",
    permission: null, // owner-only
    danger: true,
    condition: (row) => !row.is_owner, // cannot delete owner
    confirm: {
      title: "حذف کاربر",
      message: "آیا از حذف این کاربر اطمینان دارید؟",
    },
  },
];

export const USER_BULK_ACTIONS = [
  {
    key: "toggle_active",
    label: "فعال/غیرفعال",
    icon: ShieldCheck,
    variant: "outline",
    type: "bulk",
    permission: null,
    handler: "toggle_active",
  },
  {
    key: "change_role",
    label: "تغییر نقش",
    icon: UserPlus,
    variant: "outline",
    type: "bulk",
    permission: null,
    modal: "change_role",
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
      message: "آیا از حذف کاربران انتخاب‌شده اطمینان دارید؟",
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

export const USER_ALL_ACTIONS = [...USER_ROW_ACTIONS, ...USER_BULK_ACTIONS];