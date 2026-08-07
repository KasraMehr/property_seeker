import { CheckCircle2, XCircle } from "lucide-react";

/**
 * ActivityLog.Outcome (models.py)
 * choices = [success, failed]
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