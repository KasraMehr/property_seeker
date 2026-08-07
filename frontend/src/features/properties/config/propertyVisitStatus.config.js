import { Calendar, CheckCircle2, CheckCircle, XCircle, UserX } from "lucide-react";

/**
 * PropertyVisit.Status (models.py)
 * choices = [scheduled, confirmed, completed, canceled, no_show]
 */
export const PROPERTY_VISIT_STATUS_CONFIG = {
  scheduled: {
    label: "برنامه‌ریزی شده",
    icon: Calendar,
    color: "info",
  },
  confirmed: {
    label: "تأیید شده",
    icon: CheckCircle2,
    color: "success",
  },
  completed: {
    label: "انجام شده",
    icon: CheckCircle,
    color: "success",
  },
  canceled: {
    label: "لغو شده",
    icon: XCircle,
    color: "danger",
  },
  no_show: {
    label: "حضور نیافت",
    icon: UserX,
    color: "neutral",
  },
};