import { Clock, Loader2, CheckCircle2, AlertTriangle, XCircle, Ban } from "lucide-react";

/**
 * IngestionRun.Status (models.py)
 * choices = [queued, running, succeeded, partial, failed, cancelled]
 */
export const INGESTION_RUN_STATUS_CONFIG = {
  queued: {
    label: "در صف",
    icon: Clock,
    color: "neutral",
  },
  running: {
    label: "در حال اجرا",
    icon: Loader2,
    color: "info",
  },
  succeeded: {
    label: "موفق",
    icon: CheckCircle2,
    color: "success",
  },
  partial: {
    label: "نیمه‌موفق",
    icon: AlertTriangle,
    color: "warning",
  },
  failed: {
    label: "ناموفق",
    icon: XCircle,
    color: "danger",
  },
  cancelled: {
    label: "لغو شده",
    icon: Ban,
    color: "neutral",
  },
};  