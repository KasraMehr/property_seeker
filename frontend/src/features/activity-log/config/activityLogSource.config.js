import { Globe, Shield, Server, Clock } from "lucide-react";

/**
 * ActivityLog.Source (models.py)
 * choices = [api, admin, system, cron]
 */
export const ACTIVITY_LOG_SOURCE_CONFIG = {
  api: {
    label: "API",
    icon: Globe,
    color: "sky",
  },
  admin: {
    label: "پنل مدیریت",
    icon: Shield,
    color: "violet",
  },
  system: {
    label: "سیستم",
    icon: Server,
    color: "neutral",
  },
  cron: {
    label: "زمان‌بندی",
    icon: Clock,
    color: "warning",
  },
};