import {
  Hash,
  MapPin,
  Home,
  Building2,
  Users,
  BarChart3,
  FileText,
  PhoneCall,
  ClipboardList,
  Calendar,
  UserCheck,
  TrendingUp,
} from "lucide-react";

/* ─── Tabs ─── */
export const REGION_DETAIL_TABS = [
  { key: "details", label: "مشخصات منطقه", icon: MapPin },
  { key: "agents", label: "کارشناسان منطقه", icon: Users },
  { key: "stats", label: "آمار و عملکرد", icon: BarChart3 },
];

/* ─── Icon Map ─── */
export const REGION_ICON_MAP = {
  id: Hash,
  name: MapPin,
  city: Building2,
  neighborhoods_count: Home,
  addresses_count: Building2,
  listings_count: FileText,
  properties_count: Home,
  calls_count: PhoneCall,
  followups_count: ClipboardList,
  agents_count: Users,
  created_at: Calendar,
  updated_at: Calendar,
  coverage: TrendingUp,
  agent_name: UserCheck,
  agent_phone: PhoneCall,
  agent_role: UserCheck,
  neighborhood_name: Home,
};

/* ─── Tab 1: Region Details ─── */
export const REGION_DETAIL_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "id", label: "شناسه منطقه", format: (v) => `#${v}` },
      { key: "name", label: "نام منطقه", fullWidth: true },
      { key: "city", label: "شهر", type: "nested", nestedKey: "name" },
    ],
  },
  {
    section: "counts",
    sectionLabel: "شمارش‌ها",
    fields: [
      { key: "neighborhoods_count", label: "تعداد محله‌ها" },
      { key: "addresses_count", label: "تعداد آدرس‌ها" },
      { key: "listings_count", label: "تعداد آگهی‌ها" },
      { key: "agents_count", label: "تعداد کارشناسان" },
    ],
  },
];