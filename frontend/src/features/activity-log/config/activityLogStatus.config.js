import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  LogIn,
  LogOut,
  RefreshCw,
  Zap,
  Globe,
  Shield,
  Server,
  Clock,
  Info,
  AlertTriangle,
  XCircle,
  Siren,
  CheckCircle2,
} from "lucide-react";

/**
 * 1. ActivityLog.Action
 */
export const ACTIVITY_LOG_ACTION_CONFIG = {
  create: {
    label: "ایجاد",
    icon: Plus,
    color: "emerald",
  },
  update: {
    label: "ویرایش",
    icon: Pencil,
    color: "blue",
  },
  delete: {
    label: "حذف",
    icon: Trash2,
    color: "rose",
  },
  view: {
    label: "مشاهده",
    icon: Eye,
    color: "slate",
  },
  login: {
    label: "ورود",
    icon: LogIn,
    color: "teal",
  },
  logout: {
    label: "خروج",
    icon: LogOut,
    color: "amber",
  },
  status_change: {
    label: "تغییر وضعیت",
    icon: RefreshCw,
    color: "purple",
  },
  api_call: {
    label: "درخواست API",
    icon: Zap,
    color: "sky",
  },
};

/**
 * 2. ActivityLog.Source
 */
export const ACTIVITY_LOG_SOURCE_CONFIG = {
  api: {
    label: "API",
    icon: Globe,
    color: "sky",
  },
  admin: {
    label: "پنل مدیریت",
    icon: Shield,
    color: "violet",
  },
  system: {
    label: "سیستم",
    icon: Server,
    color: "neutral",
  },
  cron: {
    label: "زمانبندی",
    icon: Clock,
    color: "warning",
  },
};

/**
 * 3. ActivityLog.Level
 */
export const ACTIVITY_LOG_LEVEL_CONFIG = {
  info: {
    label: "اطلاعات",
    icon: Info,
    color: "info",
  },
  warning: {
    label: "هشدار",
    icon: AlertTriangle,
    color: "warning",
  },
  error: {
    label: "خطا",
    icon: XCircle,
    color: "danger",
  },
  critical: {
    label: "بحرانی",
    icon: Siren,
    color: "danger",
  },
};

/**
 * 4. ActivityLog.Outcome
 */
export const ACTIVITY_LOG_OUTCOME_CONFIG = {
  success: {
    label: "موفق",
    icon: CheckCircle2,
    color: "success",
  },
  failed: {
    label: "ناموفق",
    icon: XCircle,
    color: "danger",
  },
};