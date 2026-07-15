import { House, Sparkles, LayoutDashboard, MessageCircle } from "lucide-react";

export const NAVBAR_STRINGS = {
  menuItems: [
    {
      id: "home",
      label: "خانه",
      href: "#home",
      icon: House,
      type: "scroll",
    },
    {
      id: "dashboard",
      label: "داشبورد",
      href: "#dashboard",
      icon: LayoutDashboard,
      type: "scroll",
    },
    {
      id: "features",
      label: "امکانات",
      href: "#features",
      icon: Sparkles,
      type: "scroll",
    },
    {
      id: "contact",
      label: "تماس",
      href: "#contact",
      icon: MessageCircle,
      type: "scroll",
    },
  ],

  ctaLogin: "ورود",

  ctaDashboard: "داشبورد",
};

export const HERO_STRINGS = {
  titleFirst: "تبدیل آگهی ها",
  titleSecond: "به فایل‌های طلایی",

  subtitle:
    "سیستم هوشمند تولید فایل ملکی از آگهی‌های آنلاین - بدون واسطه، حرفه‌ای، سریع",

  features: [
    {
      label: "استخراج آگهی",
    },
    {
      label: "تکمیل اطلاعات",
    },
    {
      label: "فایل اختصاصی",
    },
  ],

  primaryButton: "شروع کنید",
  secondaryButton: "مشاهده دمو",

  imageAlt: "Real estate file management system",
};

// TODO: add more text here
