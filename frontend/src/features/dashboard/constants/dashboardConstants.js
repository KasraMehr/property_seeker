import { 
  LayoutDashboard, 
  Building2, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut 
} from "lucide-react";

export const DASHBOARD_STRINGS = {
  
  actionLogout: "خروج از حساب",
  
  //Header
  guestUser: "کاربر مهمان",
  roleOwner: "مدیر آژانس / مالک",
  roleDefault: "کارشناس",
};

export const DASHBOARD_MENU_ITEMS = [
  {
    type: "route",
    to: "/dashboard",
    label: "داشبورد",
    icon: LayoutDashboard,
  },
  {
    type: "route",
    to: "/dashboard/properties",
    label: "املاک",
    icon: Building2,
  },
  {
    type: "route",
    to: "/dashboard/listings",
    label: "آگهی ها",
    icon: Building2,
  },
  {
    type: "route",
    to: "/dashboard/users",
    label: "مدیریت کاربران",
    icon: Users,
    ownerOnly: true, // Just for owner 
  },
];

export const DASHBOARD_FOOTER_ITEMS = [
  {
    type: "route",
    to: "/dashboard/settings",
    label: "تنظیمات سیستم",
    icon: Settings,
  },
];