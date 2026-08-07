import {
  Eye, Pencil, Trash2, Phone, Clock, Star, History, Home,
  ArrowRightLeft, Download, CheckCircle2, Ban
} from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";

/**
 * Property Actions Config
 * Backend: properties.Property
 */

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
    permission: PERMISSIONS.PROPERTY.CHANGE,
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
    key: "add_followup",
    label: "ثبت پیگیری",
    icon: Clock,
    variant: "outline",
    type: "row",
    permission: null,
    modal: "add_followup",
  },
  {
    key: "view_owner",
    label: "مشاهده مالک",
    icon: Home,
    variant: "ghost",
    type: "row",
    permission: PERMISSIONS.OWNER.VIEW,
    condition: (row) => !!row.owner,
    modal: "owner_detail",
  },
  {
    key: "view_listing",
    label: "مشاهده آگهی مبدا",
    icon: Star,
    variant: "ghost",
    type: "row",
    permission: null,
    condition: (row) => !!row.listing, // if property came from listing
    modal: "listing_detail",
  },
  {
    key: "delete",
    label: "حذف",
    icon: Trash2,
    variant: "ghost",
    type: "row",
    permission: PERMISSIONS.PROPERTY.DELETE,
    danger: true,
    confirm: {
      title: "حذف ملک",
      message: "آیا از حذف این فایل ملکی اطمینان دارید؟",
    },
  },
];

export const PROPERTY_BULK_ACTIONS = [
  {
    key: "change_status",
    label: "تغییر وضعیت",
    icon: ArrowRightLeft,
    variant: "outline",
    type: "bulk",
    permission: PERMISSIONS.PROPERTY.CHANGE,
    modal: "change_status",
  },
  {
    key: "change_deal_type",
    label: "تغییر نوع معامله",
    icon: CheckCircle2,
    variant: "outline",
    type: "bulk",
    permission: PERMISSIONS.PROPERTY.CHANGE,
    modal: "change_deal_type",
  },
  {
    key: "assign_agent",
    label: "تخصیص مشاور",
    icon: Home,
    variant: "outline",
    type: "bulk",
    permission: PERMISSIONS.PROPERTY.CHANGE,
    modal: "assign_agent",
  },
  {
    key: "delete",
    label: "حذف انتخاب‌شده‌ها",
    icon: Trash2,
    variant: "outline",
    type: "bulk",
    permission: PERMISSIONS.PROPERTY.DELETE,
    danger: true,
    confirm: {
      title: "حذف گروهی",
      message: "آیا از حذف فایل‌های انتخاب‌شده اطمینان دارید؟",
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

export const PROPERTY_ALL_ACTIONS = [...PROPERTY_ROW_ACTIONS, ...PROPERTY_BULK_ACTIONS];