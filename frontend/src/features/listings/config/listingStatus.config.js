import {
  Eye,
  FileText,
  PauseCircle,
  CheckCircle2,
  Home,
  Clock,
  Archive,
} from "lucide-react";

/**
 * Listing.Status (models.py)
 * choices = [draft, active, paused, sold, rented, expired, archived]
 */
export const LISTING_STATUS_CONFIG = {
  draft: {
    label: "پیش نویس",
    icon: FileText,
    color: "neutral",
  },
  active: {
    label: "فعال",
    icon: Eye,
    color: "success",
  },
  paused: {
    label: "متوقف",
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
  expired: {
    label: "منقضی شده",
    icon: Clock,
    color: "danger",
  },
  archived: {
    label: "آرشیو",
    icon: Archive,
    color: "neutral",
  },
};