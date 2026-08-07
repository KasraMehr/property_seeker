import {
  Hash, Target, Link2, Play, Pause, Clock, Calendar,
  GitCommit, Search, RefreshCw, GitCompare, Globe,
  Settings, BarChart3, AlertTriangle, CheckCircle2
} from "lucide-react";

/**
 * ScrapeTarget Detail Modal Config
 * Backend: ingestion.ScrapeTarget + ingestion.IngestionRun
 * Tabs: details | runs | listings
 */

/* ─── Tabs ─── */
export const SCRAPER_TARGET_DETAIL_TABS = [
  { key: "details", label: "مشخصات تارگت", icon: Target },
  { key: "runs", label: "تاریخچه اجراها", icon: GitCommit },
  { key: "listings", label: "آگهی‌های کشف‌شده", icon: Globe },
];

/* ─── Icon Map ─── */
export const SCRAPER_TARGET_ICON_MAP = {
  id: Hash,
  name: Target,
  source: Globe,
  search_url: Link2,
  enabled: Play,
  discovery_interval_minutes: Clock,
  incremental_known_streak: BarChart3,
  incremental_max_cards: Settings,
  last_watermark_external_id: Hash,
  last_discovery_at: Calendar,
  last_full_discovery_at: Calendar,
  created_at: Calendar,
  updated_at: Calendar,
};

/* ─── Tab 1: Target Details ─── */
export const SCRAPER_TARGET_DETAIL_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "id", label: "شناسه", format: (v) => `#${v}` },
      { key: "name", label: "نام تارگت", fullWidth: true },
      { key: "source", label: "منبع", type: "nested", nestedKey: "name" },
      { key: "search_url", label: "URL جستجو", type: "link", fullWidth: true },
    ],
  },
  {
    section: "settings",
    sectionLabel: "تنظیمات",
    fields: [
      { key: "enabled", label: "وضعیت", type: "boolean", trueLabel: "فعال", falseLabel: "غیرفعال" },
      { key: "discovery_interval_minutes", label: "فاصله کشف (دقیقه)", suffix: " دقیقه" },
      { key: "incremental_known_streak", label: "Streak شناخته‌شده" },
      { key: "incremental_max_cards", label: "حداکثر کارت‌های افزایشی" },
    ],
  },
  {
    section: "watermark",
    sectionLabel: "Watermark و آخرین وضعیت",
    fields: [
      { key: "last_watermark_external_id", label: "آخرین Watermark ID", type: "mono" },
      { key: "last_discovery_at", label: "آخرین کشف", type: "date" },
      { key: "last_full_discovery_at", label: "آخرین کشف کامل", type: "date" },
    ],
  },
  {
    section: "dates",
    sectionLabel: "تاریخ‌ها",
    fields: [
      { key: "created_at", label: "تاریخ ثبت", type: "date" },
      { key: "updated_at", label: "آخرین بروزرسانی", type: "date" },
    ],
  },
];

/* ─── Tab 2: Runs List (ingestion.IngestionRun) ─── */
export const SCRAPER_TARGET_RUN_COLUMNS = [
  { key: "id", header: "شناسه اجرا", type: "mono", format: (v) => v?.slice(0, 8) + "..." },
  { key: "mode", header: "حالت", type: "status", configKey: "ingestionRunMode" },
  { key: "status", header: "وضعیت", type: "status", configKey: "ingestionRunStatus" },
  { key: "discovered_count", header: "کشف" },
  { key: "processed_count", header: "پردازش" },
  { key: "new_count", header: "جدید" },
  { key: "changed_count", header: "تغییر" },
  { key: "failed_count", header: "خطا" },
  { key: "started_at", header: "شروع", type: "date" },
  { key: "finished_at", header: "پایان", type: "date" },
];

/* ─── Tab 3: Listings (ingestion.TargetListing → listing.Listing) ─── */
export const SCRAPER_TARGET_LISTING_COLUMNS = [
  { key: "listing", header: "آگهی", type: "nested", nestedKey: "title" },
  { key: "first_seen_at", header: "اولین مشاهده", type: "date" },
  { key: "last_seen_at", header: "آخرین مشاهده", type: "date" },
  { key: "consecutive_full_absences", header: "غیبت‌ها" },
];