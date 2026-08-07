import { Info, AlertTriangle, XCircle, Siren } from "lucide-react";

/**
 * ActivityLog.Level (models.py)
 * choices = [info, warning, error, critical]
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