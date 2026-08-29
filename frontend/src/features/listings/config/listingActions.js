import {
  Eye,
  Phone,
  ExternalLink,
  Star,
  XCircle,
  CheckCircle2,
  ArrowRightLeft,
  ClipboardCheck,
} from "lucide-react";
// import { PERMISSIONS } from "@/constants/permissions";

export const LISTING_ROW_ACTIONS = [
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
    key: "promote",
    label: "تبدیل به ملک",
    icon: ArrowRightLeft,
    variant: "default",
    type: "row",
    permission: null,
    visible: (row) => row.review_status !== "promoted",
    modal: "promote",
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
    key: "change_review_status",
    label: "تغییر وضعیت بررسی",
    icon: ClipboardCheck,
    variant: "outline",
    type: "row",
    permission: null,
    visible: () => true,
    modal: "review_status",
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
  // {
  //   key: "shortlist",
  //   label: "منتخب",
  //   icon: Star,
  //   variant: "outline",
  //   type: "row",
  //   permission: null, // بعداً: PERMISSIONS.REVIEW_LISTING
  //   condition: (row) => row.review_status !== "shortlisted",
  //   handler: "review",
  //   handlerPayload: () => ({ review_status: "shortlisted" }),
  // },
  // {
  //   key: "reject",
  //   label: "رد کردن",
  //   icon: XCircle,
  //   variant: "outline",
  //   type: "row",
  //   permission: null,
  //   condition: (row) => row.review_status !== "rejected",
  //   handler: "review",
  //   handlerPayload: () => ({ review_status: "rejected" }),
  // },
  

];

export const LISTING_BULK_ACTIONS = [
  {
    key: "bulk_shortlist",
    label: "منتخب کردن",
    icon: Star,
    variant: "outline",
    type: "bulk",
    handler: "bulk_review",
    handlerPayload: () => ({ review_status: "shortlisted" }),
  },
  {
    key: "bulk_reject",
    label: "رد کردن",
    icon: XCircle,
    variant: "outline",
    type: "bulk",
    handler: "bulk_review",
    handlerPayload: () => ({ review_status: "rejected" }),
  },
];

export const LISTING_ALL_ACTIONS = [
  ...LISTING_ROW_ACTIONS,
  ...LISTING_BULK_ACTIONS,
];