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
  BarChart3
} from "lucide-react";

export const DASHBOARD_STRINGS = {
  actionLogout: "خروج از حساب",
  guestUser: "کاربر مهمان",
  roleOwner: "مدیر سیستم",
  roleOperator: "اپراتور سیستم",
};

// Operator menu items
export const OPERATOR_NAV_ITEMS = [
  { id: 'dashboard', label: 'داشبورد', path: '/operator/dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'آگهی‌های من', path: '/operator/leads', icon: Building2 },
  { id: 'calls', label: 'تماس‌های من', path: '/operator/calls', icon: PhoneCall },
  { id: 'properties', label: 'فایل‌های من', path: '/operator/properties', icon: FolderCheck },
  { id: 'followups', label: 'پیگیری‌ها', path: '/operator/followups', icon: CalendarClock },
];

// Admin menu items
export const ADMIN_NAV_ITEMS = [
  { id: 'dashboard', label: 'داشبورد کل', path: '/admin/dashboard', icon: LayoutDashboard },
  { id: 'listings', label: 'آگهی ها', path: '/admin/listings', icon: NotebookTabs},
  { id: 'users', label: 'مدیریت کارمندان', path: '/admin/users', icon: Users },
  { id: 'regions', label: 'مدیریت مناطق', path: '/admin/regions', icon: MapPin },
  { id: 'scraper', label: 'مدیریت اسکرپر', path: '/admin/scraper', icon: Bot },
  { id: 'reports', label: 'گزارش‌ها', path: '/admin/reports', icon: BarChart3 },
];