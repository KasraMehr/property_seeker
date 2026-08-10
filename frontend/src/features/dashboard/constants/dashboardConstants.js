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
  SquareActivity,
  UserRound,
  Phone,
  Mail,
  CreditCard,
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


/**
 * Editable profile settings
 *
 * Only fields that the currently authenticated user
 * can reasonably edit are placed here.
 */
export const PROFILE_SETTINGS = [
  {
    key: "personal",
    title: "اطلاعات شخصی",
    description: "اطلاعات پایه حساب کاربری خود را مدیریت کنید.",
    icon: UserRound,
    columns: 2,

    fields: [
      {
        name: "full_name",
        label: "نام و نام خانوادگی",
        type: "text",
        placeholder: "مثلاً علی احمدی",
        icon: UserRound,
        required: true,
        fullWidth: false,
      },

      {
        name: "national_id",
        label: "کد ملی",
        type: "text",
        placeholder: "۱۰ رقم",
        icon: CreditCard,
        required: false,
      },
    ],
  },

  {
    key: "contact",
    title: "اطلاعات تماس",
    description: "راه‌های ارتباطی خود را مدیریت کنید.",
    icon: Phone,
    columns: 2,

    fields: [
      {
        name: "phone",
        label: "شماره موبایل",
        type: "phone",
        placeholder: "۰۹۱۲۳۴۵۶۷۸۹",
        icon: Phone,
        required: true,
      },

      {
        name: "email",
        label: "ایمیل",
        type: "email",
        placeholder: "example@mail.com",
        icon: Mail,
        required: false,
      },
    ],
  },
];