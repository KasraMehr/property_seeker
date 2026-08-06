import {
  CheckCircle2,
  PhoneMissed,
  PhoneOff,
  Voicemail,
  Clock,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
} from "lucide-react";

/* ─── Call.Result ─── */
export const CALL_RESULT_CONFIG = {
  answered: {
    label: "پاسخ داده",
    icon: CheckCircle2,
    color: "success",
  },
  no_answer: {
    label: "بدون پاسخ",
    icon: PhoneMissed,
    color: "danger",
  },
  busy: {
    label: "مشغول",
    icon: PhoneOff,
    color: "warning",
  },
  voicemail: {
    label: "صندوق صوتی",
    icon: Voicemail,
    color: "info",
  },
  callback_requested: {
    label: "درخواست تماس مجدد",
    icon: Clock,
    color: "warning",
  },
};

/* ─── Call.CallType ─── */
export const CALL_TYPE_CONFIG = {
  incoming: {
    label: "ورودی",
    icon: PhoneIncoming,
    color: "sky",
    bg: "bg-sky-500/10",
    text: "text-sky-500",
  },
  outgoing: {
    label: "خروجی",
    icon: PhoneOutgoing,
    color: "emerald",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
  },
  unknown: {
    label: "نامشخص",
    icon: Phone,
    color: "neutral",
  },
};