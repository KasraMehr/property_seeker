import { Eye, PauseCircle, CheckCircle2, Home, Archive } from "lucide-react";

/**
 * Property.Status (models(1).py)
 * choices = [available, reserved, sold, rented, archived]
 */
export const PROPERTY_STATUS_CONFIG = {
  available: {
    label: "فعال",
    icon: Eye,
    color: "success",
  },
  reserved: {
    label: "رزرو",
    icon: PauseCircle,
    color: "warning",
  },
  sold: {
    label: "فروخته شده",
    icon: CheckCircle2,
    color: "info",
  },
  rented: {
    label: "اجاره داده شده",
    icon: Home,
    color: "success",
  },
  archived: {
    label: "بایگانی",
    icon: Archive,
    color: "neutral",
  },
};