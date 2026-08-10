import { Globe, Search, RefreshCw, GitCompare } from "lucide-react";

/**
 * ingestionRun.Mode (models.py)
 * choices = [full, discovery, refresh, reconciliation]
 */
export const INGESTION_RUN_MODE_CONFIG = {
  full: {
    label: "کامل",
    icon: Globe,
    color: "violet",
  },
  discovery: {
    label: "کشف",
    icon: Search,
    color: "success",
  },
  refresh: {
    label: "بروزرسانی",
    icon: RefreshCw,
    color: "sky",
  },
  reconciliation: {
    label: "تطبیق",
    icon: GitCompare,
    color: "warning",
  },
};