import {
  Eye, Pencil, Trash2, Home, Phone, ExternalLink, ArrowRightLeft,
  CheckCircle2, XCircle, Star, Ban, Download, Send
} from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";

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
    key: "register_call",
    label: "ثبت تماس",
    icon: Phone,
    variant: "outline",
    type: "row",
    permission: null,
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
];

export const LISTING_BULK_ACTIONS = []; 
export const LISTING_ALL_ACTIONS = [...LISTING_ROW_ACTIONS];