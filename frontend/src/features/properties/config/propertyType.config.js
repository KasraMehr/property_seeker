import { Home, TreePine, Building2, Store, Briefcase, Warehouse } from "lucide-react";

/**
 * Property.Type choices
 * APARTMENT, VILLA, LAND, COMMERCIAL, OFFICE, STORE
 */
export const PROPERTY_TYPE_CONFIG = {
  APARTMENT: {
    label: "آپارتمان",
    icon: Home,
    color: "sky",
  },
  VILLA: {
    label: "ویلا",
    icon: TreePine,
    color: "emerald",
  },
  LAND: {
    label: "زمین",
    icon: Warehouse,
    color: "amber",
  },
  COMMERCIAL: {
    label: "تجاری",
    icon: Store,
    color: "purple",
  },
  OFFICE: {
    label: "دفتر",
    icon: Briefcase,
    color: "blue",
  },
  STORE: {
    label: "مغازه",
    icon: Building2,
    color: "rose",
  },
};
