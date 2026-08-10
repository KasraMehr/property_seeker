import { Eye, Pencil, Trash2, Phone } from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";

export const PROPERTY_ROW_ACTIONS = [
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
    permission: PERMISSIONS.PROPERTY?.CHANGE ?? null,
    modal: "edit",
  },
  {
    key: "register_call",
    label: "ثبت تماس",
    icon: Phone,
    variant: "outline",
    type: "row",
    permission: null,
    modal: "register_call",
  },
  {
    key: "delete",
    label: "حذف",
    icon: Trash2,
    variant: "ghost",
    type: "row",
    permission: PERMISSIONS.PROPERTY?.DELETE ?? null,
    danger: true,
  },
];

export const PROPERTY_BULK_ACTIONS = [
  {
    key: "delete",
    label: "حذف انتخاب‌شده‌ها",
    icon: Trash2,
    variant: "outline",
    type: "bulk",
    permission: PERMISSIONS.PROPERTY?.DELETE ?? null,
    danger: true,
  },
];

export const PROPERTY_ALL_ACTIONS = [
  ...PROPERTY_ROW_ACTIONS,
  ...PROPERTY_BULK_ACTIONS,
];