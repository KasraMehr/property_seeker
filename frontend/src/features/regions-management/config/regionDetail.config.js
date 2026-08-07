import {
  Hash, MapPin, Home, Building2, Users, BarChart3,
  FileText, PhoneCall, ClipboardList, Calendar, UserCheck,
  TrendingUp, City, Landmark, Navigation
} from "lucide-react";

/**
 * Region (District) Detail Modal Config
 * Backend: locations.District
 * Tabs: details | neighborhoods
 */

/* ─── Tabs ─── */
export const REGION_DETAIL_TABS = [
  { key: "details", label: "مشخصات منطقه", icon: MapPin },
  { key: "neighborhoods", label: "محله‌ها", icon: Home },
];

/* ─── Icon Map ─── */
export const REGION_ICON_MAP = {
  id: Hash,
  name: MapPin,
  city: City,
  province: Landmark,
  neighborhoods: Home,
  addresses: Building2,
  agents: Users,
  created_at: Calendar,
  updated_at: Calendar,
};

/* ─── Tab 1: Region Details ─── */
export const REGION_DETAIL_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "id", label: "شناسه", format: (v) => `#${v}` },
      { key: "name", label: "نام منطقه", fullWidth: true },
      { key: "city", label: "شهر", type: "nested", nestedKey: "name" },
      { key: "city.province", label: "استان", type: "nested", nestedKey: "province.name" },
    ],
  },
  {
    section: "computed",
    sectionLabel: "آمار محاسبه‌شده (فرانت‌اند)",
    fields: [
      { key: "neighborhoods_count", label: "تعداد محله‌ها" },
      { key: "addresses_count", label: "تعداد آدرس‌ها" },
      { key: "agents_count", label: "تعداد کارشناسان" },
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

/* ─── Tab 2: Neighborhoods List (locations.Neighborhood) ─── */
export const REGION_NEIGHBORHOOD_COLUMNS = [
  { key: "id", header: "شناسه", type: "mono" },
  { key: "name", header: "نام محله" },
  { key: "addresses_count", header: "تعداد آدرس", type: "number" },
];