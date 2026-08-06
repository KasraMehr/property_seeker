import { CheckCircle2, XCircle, Crown, Shield } from "lucide-react";

/* ─── Account Status ─── */
export const USER_STATUS_CONFIG = {
  active: {
    label: "فعال",
    icon: CheckCircle2,
    color: "success",
  },
  inactive: {
    label: "غیرفعال",
    icon: XCircle,
    color: "danger",
  },
};

/* ─── Owner Flag ─── */
export const USER_OWNER_CONFIG = {
  true: {
    label: "مالک",
    icon: Crown,
    color: "violet",
  },
  false: {
    label: "کارمند",
    icon: Shield,
    color: "neutral",
  },
};