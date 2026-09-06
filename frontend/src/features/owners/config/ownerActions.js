// FILE: ownerActions.js
// ACTION: MUST ADD TO CONFIG

import { Eye, Pencil, Trash2 } from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";

/**
 * Owner Row Actions
 * Backend: properties.Owner endpoints
 */
export const OWNER_ROW_ACTIONS = [
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
    permission: PERMISSIONS?.OWNER?.CHANGE || null,
    modal: "edit",
  },
  {
    key: "delete",
    label: "حذف",
    icon: Trash2,
    variant: "ghost",
    type: "row",
    permission: PERMISSIONS?.OWNER?.DELETE || null,
    danger: true,
    confirm: {
      title: "حذف مالک",
      message: "آیا از حذف این مالک اطمینان دارید؟",
    },
  },
];

export const OWNER_BULK_ACTIONS = [
  {
    key: "delete",
    label: "حذف انتخاب‌شده‌ها",
    icon: Trash2,
    variant: "danger",
    type: "bulk",
    permission: PERMISSIONS?.OWNER?.DELETE || null,
    danger: true,
    confirm: {
      title: "حذف گروهی مالکان",
      message: "آیا از حذف مالکان انتخاب‌شده اطمینان دارید؟",
    },
  },
];

export const OWNER_ALL_ACTIONS = [...OWNER_ROW_ACTIONS, ...OWNER_BULK_ACTIONS];