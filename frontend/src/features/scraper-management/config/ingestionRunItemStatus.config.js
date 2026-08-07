import { Clock, Loader2, CheckCircle2, XCircle, Trash2, SkipForward } from "lucide-react";

/**
 * IngestionRunItem.Status (models.py)
 * choices = [pending, running, succeeded, failed, removed, skipped]
 */
export const INGESTION_RUN_ITEM_STATUS_CONFIG = {
  pending: {
    label: "در انتظار",
    icon: Clock,
    color: "neutral",
  },
  running: {
    label: "در حال پردازش",
    icon: Loader2,
    color: "info",
  },
  succeeded: {
    label: "موفق",
    icon: CheckCircle2,
    color: "success",
  },
  failed: {
    label: "ناموفق",
    icon: XCircle,
    color: "danger",
  },
  removed: {
    label: "حذف شده از منبع",
    icon: Trash2,
    color: "danger",
  },
  skipped: {
    label: "رد شده",
    icon: SkipForward,
    color: "neutral",
  },
};