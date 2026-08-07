import {
  Eye, Pencil, Trash2, Home, Phone, ExternalLink, ArrowRightLeft,
  CheckCircle2, XCircle, Star, Ban, Download, Send
} from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";

/**
 * Listing Actions Config
 * Backend: listing.Listing
 * 
 *  LISTING permissions are [PEND] in backend.
 *    Using convention-based codenames. Update when backend views are ready.
 */

export const LISTING_ROW_ACTIONS = [
  {
    key: "view",
    label: "مشاهده",
    icon: Eye,
    variant: "ghost",
    type: "row",
    permission: null, // view is default
    modal: "detail",
  },
  {
    key: "edit",
    label: "ویرایش",
    icon: Pencil,
    variant: "ghost",
    type: "row",
    permission: "change_listing", // PEND — update when ready
    modal: "edit",
  },
  {
    key: "promote",
    label: "تبدیل به ملک",
    icon: Home,
    variant: "primary",
    type: "row",
    permission: "promote_listing", // PEND
    condition: (row) => row.review_status === "shortlisted" && !row.property,
    modal: "promote",
    confirm: {
      title: "تبدیل آگهی به ملک",
      message: "آیا از تبدیل این آگهی به فایل ملکی اطمینان دارید؟ این عملیات غیرقابل بازگشت است.",
    },
  },
  {
    key: "shortlist",
    label: "کوت‌لیست",
    icon: Star,
    variant: "outline",
    type: "row",
    permission: "change_listing",
    condition: (row) => row.review_status === "unreviewed",
    handler: "change_review_status",
    handlerPayload: { review_status: "shortlisted" },
  },
  {
    key: "reject",
    label: "رد",
    icon: XCircle,
    variant: "outline",
    type: "row",
    permission: "change_listing",
    condition: (row) => row.review_status === "unreviewed" || row.review_status === "shortlisted",
    danger: true,
    handler: "change_review_status",
    handlerPayload: { review_status: "rejected" },
  },
  {
    key: "register_call",
    label: "ثبت تماس",
    icon: Phone,
    variant: "outline",
    type: "row",
    permission: null, // any authenticated user
    modal: "register_call",
  },
  {
    key: "open_source",
    label: "مشاهده منبع",
    icon: ExternalLink,
    variant: "ghost",
    type: "row",
    permission: null,
    condition: (row) => !!row.url,
    handler: "open_url",
    handlerPayload: (row) => row.url,
  },
  {
    key: "delete",
    label: "حذف",
    icon: Trash2,
    variant: "ghost",
    type: "row",
    permission: "delete_listing", // PEND
    danger: true,
    confirm: {
      title: "حذف آگهی",
      message: "آیا از حذف این آگهی اطمینان دارید؟",
    },
  },
];

export const LISTING_BULK_ACTIONS = [
  {
    key: "change_status",
    label: "تغییر وضعیت",
    icon: ArrowRightLeft,
    variant: "outline",
    type: "bulk",
    permission: "change_listing",
    modal: "change_status",
  },
  {
    key: "change_review_status",
    label: "تغییر وضعیت بررسی",
    icon: Star,
    variant: "outline",
    type: "bulk",
    permission: "change_listing",
    modal: "change_review_status",
  },
  {
    key: "delete",
    label: "حذف انتخاب‌شده‌ها",
    icon: Trash2,
    variant: "outline",
    type: "bulk",
    permission: "delete_listing",
    danger: true,
    confirm: {
      title: "حذف گروهی",
      message: "آیا از حذف آگهی‌های انتخاب‌شده اطمینان دارید؟",
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

export const LISTING_ALL_ACTIONS = [...LISTING_ROW_ACTIONS, ...LISTING_BULK_ACTIONS];