import {
  Eye, Pencil, Trash2, MapPin, Download
} from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";

/**
 * Region (District) Actions Config
 * Backend: locations.District
 * 
 *  Location permissions are generic. Using province/city perms as proxy.
 */

export const REGION_ROW_ACTIONS = [
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
    permission: PERMISSIONS.PROVINCE.CHANGE, // proxy
    modal: "edit",
  },
  {
    key: "delete",
    label: "حذف",
    icon: Trash2,
    variant: "ghost",
    type: "row",
    permission: PERMISSIONS.PROVINCE.DELETE, // proxy
    danger: true,
    confirm: {
      title: "حذف منطقه",
      message: "آیا از حذف این منطقه اطمینان دارید؟ تمام محله‌ها و آدرس‌های مرتبط حذف خواهند شد.",
    },
  },
];

export const REGION_BULK_ACTIONS = [
  {
    key: "delete",
    label: "حذف انتخاب‌شده‌ها",
    icon: Trash2,
    variant: "outline",
    type: "bulk",
    permission: PERMISSIONS.PROVINCE.DELETE,
    danger: true,
    confirm: {
      title: "حذف گروهی",
      message: "آیا از حذف مناطق انتخاب‌شده اطمینان دارید؟",
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

export const REGION_ALL_ACTIONS = [...REGION_ROW_ACTIONS, ...REGION_BULK_ACTIONS];