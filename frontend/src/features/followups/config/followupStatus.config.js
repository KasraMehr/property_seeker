import {
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
  RotateCcw,
  FileQuestion,
} from "lucide-react";

/* ─── Reminder.Status ─── */
export const FOLLOWUP_STATUS_CONFIG = {
  pending: {
    label: "در انتظار",
    icon: Clock,
    color: "warning",
  },
  done: {
    label: "انجام شده",
    icon: CheckCircle2,
    color: "success",
  },
  canceled: {
    label: "لغو شده",
    icon: XCircle,
    color: "danger",
  },
};

/* ─── Reminder.Type ─── */
export const FOLLOWUP_TYPE_CONFIG = {
  call: {
    label: "تماس",
    icon: Phone,
    color: "sky",
    bg: "bg-sky-500/10",
    text: "text-sky-500",
  },
  visit: {
    label: "بازدید",
    icon: MapPin,
    color: "emerald",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
  },
  follow_up: {
    label: "پیگیری",
    icon: RotateCcw,
    color: "violet",
    bg: "bg-violet-500/10",
    text: "text-violet-500",
  },
  other: {
    label: "سایر",
    icon: FileQuestion,
    color: "amber",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
  },
};