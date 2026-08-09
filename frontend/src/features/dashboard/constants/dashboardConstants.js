import {
  LayoutDashboard,
  Users,
  MapPin,
  Building2,
  PhoneCall,
  FolderCheck,
  CalendarClock,
  Bot,
  NotebookTabs,
  BarChart3,
  ContactRound,
  SquareActivity
} from "lucide-react";

export const DASHBOARD_STRINGS = {
  actionLogout: "خروج از حساب",
  guestUser: "کاربر مهمان",
  roleOwner: "مدیر سیستم",
  roleOperator: "اپراتور سیستم",
};

// Operator menu items
export const OPERATOR_NAV_ITEMS = [
  {
    id: "dashboard",
    label: "داشبورد",
    path: "/operator/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "listings",
    label: "لیدهای من",
    path: "/operator/listings",
    icon: Building2,
  },
  {
    id: "customers",
    label: "مشتری ها",
    path: "/operator/customers",
    icon: ContactRound,
  },
  {
    id: "calls",
    label: "تماس‌ها",
    path: "/operator/calls",
    icon: PhoneCall,
  },
  {
    id: "followups",
    label: "پیگیری‌ها",
    path: "/operator/followups",
    icon: CalendarClock,
  },
  {
    id: "properties",
    label: "فایل‌های من",
    path: "/operator/properties",
    icon: FolderCheck,
  },
];

// Admin menu items
export const ADMIN_NAV_ITEMS = [
  {
    id: "dashboard",
    label: "داشبورد کل",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "listings",
    label: "آگهی ها",
    path: "/admin/listings",
    icon: NotebookTabs,
  },
  {
    id: "properties",
    label: "فایل‌های ملکی",
    path: "/admin/properties",
    icon: FolderCheck,
  },
  {
    id: "customers",
    label: "مشتری ها",
    path: "/admin/customers",
    icon: ContactRound,
  },
  {
    id: "calls",
    label: "تماس‌ها",
    path: "/admin/calls",
    icon: PhoneCall,
  },
  { id: "users", label: "مدیریت کارمندان", path: "/admin/users", icon: Users },
  {
    id: "regions",
    label: "مدیریت مناطق",
    path: "/admin/regions",
    icon: MapPin,
  },
  {
    id: "scraper",
    label: "مدیریت استخراج آگهی",
    path: "/admin/scraper",
    icon: Bot,
  },
  
  { id: "reports", label: "گزارش‌ها", path: "/admin/reports", icon: BarChart3 },
  {
    id: "activity-log",
    label: "تاریخچه فعالیت ها",
    path: "/admin/activity-log",
    icon: SquareActivity,
  },
];
