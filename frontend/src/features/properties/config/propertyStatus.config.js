import {
  Eye,
  CheckCircle2,
  Home,
  PauseCircle,
  XCircle,
  FileText,
  Clock,
} from "lucide-react";

/**
 * Property.Status (models.py)
 * choices = [available, reserved, sold, rented, unavailable, draft]
 */
export const PROPERTY_STATUS_CONFIG = {
  available: {
    label: "موجود",
    icon: Eye,
    color: "success",
  },
  reserved: {
    label: "رزرو شده",
    icon: Clock,
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
  unavailable: {
    label: "غیرقابل دسترس",
    icon: XCircle,
    color: "danger",
  },
  draft: {
    label: "پیش نویس",
    icon: FileText,
    color: "neutral",
  },
};