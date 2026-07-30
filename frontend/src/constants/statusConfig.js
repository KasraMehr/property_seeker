import {
  Sparkles,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  AlertCircle,
  Ban,
  UserCheck,
  UserX,
  Home,
  FileText,
  Eye,
  Archive,
  PauseCircle,
  ShieldCheck,
  Hash,
  VolumeX,
  TrendingUp,
} from "lucide-react";

// Types of status
export const STATUS_TYPES = {
  LEAD: "lead",
  PROPERTY: "property",
  FOLLOWUP: "followup",
  USER: "user",
  CALL: "call",
  GENERIC: "generic",
};

// Semantic palette — colors live in theme.css
const PALETTE = {
  info: {
    solid: "bg-status-info text-white",
    soft: "bg-status-info-soft text-status-info",
    outline: "border border-status-info text-status-info bg-transparent",
    dot: "bg-status-info",
  },
  success: {
    solid: "bg-status-success text-white",
    soft: "bg-status-success-soft text-status-success",
    outline: "border border-status-success text-status-success bg-transparent",
    dot: "bg-status-success",
  },
  warning: {
    solid: "bg-status-warning text-white",
    soft: "bg-status-warning-soft text-status-warning",
    outline: "border border-status-warning text-status-warning bg-transparent",
    dot: "bg-status-warning",
  },
  danger: {
    solid: "bg-status-danger text-white",
    soft: "bg-status-danger-soft text-status-danger",
    outline: "border border-status-danger text-status-danger bg-transparent",
    dot: "bg-status-danger",
  },
  neutral: {
    solid: "bg-status-neutral text-white",
    soft: "bg-status-neutral-soft text-status-neutral",
    outline: "border border-status-neutral text-status-neutral bg-transparent",
    dot: "bg-status-neutral",
  },
  accent: {
    solid: "bg-status-accent text-white",
    soft: "bg-status-accent-soft text-status-accent",
    outline: "border border-status-accent text-status-accent bg-transparent",
    dot: "bg-status-accent",
  },
  special: {
    solid: "bg-status-special text-white",
    soft: "bg-status-special-soft text-status-special",
    outline: "border border-status-special text-status-special bg-transparent",
    dot: "bg-status-special",
  },
};

// Define all status
const STATUS_MAP = {
  lead: {
    new: { label: "جدید", icon: Sparkles, color: "info" },
    contacted: { label: "تماس گرفته شده", icon: Phone, color: "info" },
    qualified: { label: "تأیید صلاحیت", icon: ShieldCheck, color: "accent" },
    converted: { label: "تبدیل به مشتری", icon: TrendingUp, color: "success" },
    lost: { label: "از دست رفته", icon: XCircle, color: "neutral" },
    "follow-up": { label: "نیاز به پیگیری", icon: RotateCcw, color: "warning" },
    "no-answer": { label: "پاسخ نداد", icon: VolumeX, color: "warning" },
    callback: { label: "درخواست تماس", icon: Phone, color: "special" },
    meeting: { label: "قرار ملاقات", icon: Clock, color: "accent" },
  },

  property: {
    active: { label: "فعال", icon: Eye, color: "info" },
    draft: { label: "پیش‌نویس", icon: FileText, color: "neutral" },
    expired: { label: "منقضی شده", icon: Clock, color: "danger" },
    sold: { label: "فروخته شده", icon: CheckCircle2, color: "success" },
    rented: { label: "اجاره داده شده", icon: Home, color: "special" },
    pending: { label: "در انتظار تأیید", icon: PauseCircle, color: "warning" },
    archived: { label: "بایگانی", icon: Archive, color: "neutral" },
    featured: { label: "ویژه", icon: Sparkles, color: "accent" },
  },

  followup: {
    pending: { label: "در انتظار", icon: Clock, color: "warning" },
    done: { label: "انجام شده", icon: CheckCircle2, color: "success" },
    overdue: { label: "تأخیر", icon: AlertCircle, color: "danger" },
    cancelled: { label: "لغو شده", icon: Ban, color: "neutral" },
    rescheduled: { label: "تغییر زمان", icon: RotateCcw, color: "warning" },
  },

  user: {
    active: { label: "فعال", icon: UserCheck, color: "success" },
    inactive: { label: "غیرفعال", icon: UserX, color: "neutral" },
    suspended: { label: "معلق", icon: AlertCircle, color: "danger" },
    on_leave: { label: "مرخصی", icon: PauseCircle, color: "warning" },
  },

  call: {
    answered: { label: "پاسخ داده", icon: Phone, color: "success" },
    "no-answer": { label: "بدون پاسخ", icon: VolumeX, color: "warning" },
    busy: { label: "مشغول", icon: Phone, color: "danger" },
    callback: { label: "تماس مجدد", icon: RotateCcw, color: "warning" },
    voicemail: { label: "صندوق صوتی", icon: VolumeX, color: "neutral" },
    wrong: { label: "شماره اشتباه", icon: XCircle, color: "neutral" },
  },

  generic: {
    success: { label: "موفق", icon: CheckCircle2, color: "success" },
    error: { label: "خطا", icon: XCircle, color: "danger" },
    warning: { label: "هشدار", icon: AlertCircle, color: "warning" },
    info: { label: "اطلاعات", icon: Hash, color: "info" },
    primary: { label: "اصلی", icon: Sparkles, color: "info" },
    secondary: { label: "فرعی", icon: FileText, color: "neutral" },
  },
};

// Output
export const getStatusConfig = (status, type = "generic") => {
  const typeMap = STATUS_MAP[type] || STATUS_MAP.generic;
  const data = typeMap[status] || typeMap["info"] || STATUS_MAP.generic.info;
  const palette = PALETTE[data.color] || PALETTE.neutral;

  return {
    label: data.label,
    icon: data.icon,
    solid: palette.solid,
    soft: palette.soft,
    outline: palette.outline,
    dot: palette.dot,
  };
};

export const getStatusesByType = (type) =>
  Object.entries(STATUS_MAP[type] || {}).map(([value, data]) => ({
    value,
    label: data.label,
    color: data.color,
  }));

export const getStatusLabel = (status, type = "generic") =>
  getStatusConfig(status, type).label;
