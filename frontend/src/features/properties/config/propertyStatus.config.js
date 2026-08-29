import {
  Eye,
  CheckCircle2,
  Home,
  Clock,
  Archive,
  FileText,
} from "lucide-react";

/**
 * Property.Status (models.py)
 * choices = [available, reserved, sold, rented, archived]
 * draft added for status history compatibility
 */
export const PROPERTY_STATUS_CONFIG = {
  draft: {
    label: "پیش‌نویس",
    icon: FileText,
    color: "neutral",
  },
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
  archived: {
    label: "آرشیو",
    icon: Archive,
    color: "neutral",
  },
};