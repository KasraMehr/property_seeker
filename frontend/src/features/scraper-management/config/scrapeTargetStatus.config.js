import { Play, Pause } from "lucide-react";

/**
 * ScrapeTarget.Enabled (models.py)
 * boolean → enabled / disabled
 */
export const SCRAPE_TARGET_STATUS_CONFIG = {
  enabled: {
    label: "فعال",
    icon: Play,
    color: "success",
  },
  disabled: {
    label: "غیرفعال",
    icon: Pause,
    color: "neutral",
  },
};