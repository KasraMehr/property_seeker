import { Eye, Star, XCircle, CheckCircle2 } from "lucide-react";

/**
 * Listing.ReviewStatus (models.py)
 * choices = [unreviewed, shortlisted, rejected, promoted]
 */
export const LISTING_REVIEW_STATUS_CONFIG = {
  unreviewed: {
    label: "بررسی نشده",
    icon: Eye,
    color: "neutral",
  },
  shortlisted: {
    label: "کوت‌لیست",
    icon: Star,
    color: "warning",
  },
  rejected: {
    label: "رد شده",
    icon: XCircle,
    color: "danger",
  },
  promoted: {
    label: "تبدیل به ملک",
    icon: CheckCircle2,
    color: "success",
  },
};