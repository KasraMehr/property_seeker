import {
  CheckCircle2,
  PhoneMissed,
  PhoneOff,
  ThumbsUp,
  ThumbsDown,
  Phone,
  CalendarCheck,
  Clock,
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
  interested: {
    label: "مشتاق",
    icon: ThumbsUp,
    color: "success",
  },
  not_interested: {
    label: "غیرمشتاق",
    icon: ThumbsDown,
    color: "neutral",
  },
  follow_up: {
    label: "نیاز به پیگیری",
    icon: Clock,
    color: "warning",
  },
  visit_booked: {
    label: "بازدید ثبت شد",
    icon: CalendarCheck,
    color: "info",
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
};