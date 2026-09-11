import { Home, TreePine, Building2, Store, Briefcase, Warehouse } from "lucide-react";

/**
 * Property.Type choices
 * آپارتمان, ویلا, زمین, تجاری, دفتر, مغازه
 */
export const PROPERTY_TYPE_CONFIG = {
  آپارتمان: {
    label: "آپارتمان",
    icon: Home,
    color: "sky",
  },
  ویلا: {
    label: "ویلا",
    icon: TreePine,
    color: "emerald",
  },
  زمین: {
    label: "زمین",
    icon: Warehouse,
    color: "amber",
  },
  تجاری: {
    label: "تجاری",
    icon: Store,
    color: "purple",
  },
  دفتر: {
    label: "دفتر",
    icon: Briefcase,
    color: "blue",
  },
  مغازه: {
    label: "مغازه",
    icon: Building2,
    color: "rose",
  },
};
