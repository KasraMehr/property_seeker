
import { Eye, Pencil, Trash2, Phone, Heart, ClipboardCheck } from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";

export const CUSTOMER_ROW_ACTIONS = [
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
    permission: PERMISSIONS?.CUSTOMER?.CHANGE || null,
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
    key: "add_preference",
    label: "ثبت ترجیحات ملک",
    icon: Heart,
    variant: "outline",
    type: "row",
    permission: null,
    modal: "add_preference",
  },
  {
    key: "change_status",
    label: "تغییر وضعیت مشتری",
    icon: ClipboardCheck,
    variant: "outline",
    type: "row",
    permission: PERMISSIONS?.CUSTOMER?.CHANGE || null,
    modal: "change_status",
  },
  {
    key: "delete",
    label: "حذف",
    icon: Trash2,
    variant: "ghost",
    type: "row",
    permission: PERMISSIONS?.CUSTOMER?.DELETE || null,
    danger: true,
    confirm: {
      title: "حذف مشتری",
      message: "آیا از حذف این مشتری اطمینان دارید؟",
    },
  },
];

export const CUSTOMER_BULK_ACTIONS = [
  {
    key: "delete",
    label: "حذف انتخاب‌شده‌ها",
    icon: Trash2,
    variant: "danger",
    type: "bulk",
    permission: PERMISSIONS?.CUSTOMER?.DELETE || null,
    danger: true,
    confirm: {
      title: "حذف گروهی مشتریان",
      message: "آیا از حذف مشتریان انتخاب‌شده اطمینان دارید؟",
    },
  },
];

export const CUSTOMER_ALL_ACTIONS = [...CUSTOMER_ROW_ACTIONS, ...CUSTOMER_BULK_ACTIONS];