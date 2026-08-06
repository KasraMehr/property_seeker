import {
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  Users,
  FileText,
  Phone,
} from "lucide-react";

/* ─── Followup.Status ─── */
export const FOLLOWUP_STATUS_CONFIG = {
  pending: {
    label: "در انتظار",
    icon: Clock,
    color: "warning",
  },
  completed: {
    label: "انجام شده",
    icon: CheckCircle2,
    color: "success",
  },
  cancelled: {
    label: "لغو شده",
    icon: XCircle,
    color: "danger",
  },
};

/* ─── Followup.Type ─── */
export const FOLLOWUP_TYPE_CONFIG = {
  follow_up: {
    label: "پیگیری",
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
  meeting: {
    label: "جلسه",
    icon: Users,
    color: "violet",
    bg: "bg-violet-500/10",
    text: "text-violet-500",
  },
  contract: {
    label: "قرارداد",
    icon: FileText,
    color: "amber",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
  },
};