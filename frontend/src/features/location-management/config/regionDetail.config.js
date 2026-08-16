
import { Hash, MapPin, Building, Home } from "lucide-react";

/* ─── Tabs ─── */
export const REGION_DETAIL_TABS = [
  { key: "details", label: "مشخصات منطقه", icon: MapPin },
];

/* ─── Icon Map ─── */
export const REGION_ICON_MAP = {
  id: Hash,
  name: MapPin,
  city_name: Building,
};

/* ─── Tab 1: Region Details ─── */
export const REGION_DETAIL_FIELDS = [
  {
    section: "basic",
    sectionLabel: "اطلاعات پایه",
    fields: [
      { key: "id", label: "شناسه", format: (v) => `#${v}` },
      { key: "name", label: "نام منطقه", fullWidth: true },
      { key: "city_name", label: "شهر" },
    ],
  },
];