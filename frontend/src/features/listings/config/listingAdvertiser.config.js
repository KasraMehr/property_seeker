import { AlertTriangle, Building2, Clock3, UserRound } from "lucide-react";

export const LISTING_ADVERTISER_TYPE_CONFIG = {
  owner: {
    label: "مالک",
    icon: UserRound,
    color: "success",
  },
  agency: {
    label: "آژانس املاک",
    icon: Building2,
    color: "info",
  },
};

export const LISTING_ADVERTISER_CLASSIFICATION_STATUS_CONFIG = {
  pending: {
    label: "در انتظار تشخیص",
    icon: Clock3,
    color: "warning",
  },
  succeeded: {
    label: "تشخیص انجام شد",
    icon: Building2,
    color: "success",
  },
  failed: {
    label: "تشخیص ناموفق",
    icon: AlertTriangle,
    color: "danger",
  },
};
