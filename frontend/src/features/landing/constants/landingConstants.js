import { House, Sparkles, LayoutDashboard, MessageCircle , Rocket } from "lucide-react";
import { href } from "react-router-dom";

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
      id:"problem-solution",
      label:"راه حل ها",
      href: "#problem-solution",
      icon: Rocket,
      type:"scroll",
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

export const PROBLEM_SOLUTION_STRINGS = {
  badge: "چرا ملک‌جو؟",

  titleFirst: "از آگهی‌های پراکنده",
  titleSecond: "تا فایل‌های آماده فروش",

  subtitle:
    "ملک‌جو فرآیند زمان‌بر جستجو، بررسی و ثبت فایل‌های ملکی را خودکار می‌کند تا زمان بیشتری برای مذاکره، بازدید و فروش داشته باشید.",

  problemCardTitle: "چالش‌های رایج",

  solutionCardTitle: "راه‌حل ملک‌جو",

  items: [
    {
      problem: {
        title: "آگهی‌های ناقص و غیرقابل اعتماد",
        description:
          "بخش زیادی از آگهی‌ها اطلاعات کامل ندارند و برای تکمیل آن‌ها باید زمان زیادی صرف تماس با مالک شود.",
      },

      solution: {
        title: "استخراج و تکمیل هوشمند اطلاعات",
        description:
          "ملک‌جو اطلاعات آگهی را استخراج کرده و آن را به یک فایل استاندارد و قابل استفاده تبدیل می‌کند.",
      },
    },

    {
      problem: {
        title: "اتلاف زمان در جستجوی فایل",
        description:
          "ساعت‌های زیادی صرف جستجو میان صدها آگهی تکراری و نامرتبط می‌شود.",
      },

      solution: {
        title: "دسترسی سریع به فایل‌های ارزشمند",
        description:
          "فایل‌ها به‌صورت دسته‌بندی‌شده و آماده بررسی در اختیار شما قرار می‌گیرند تا سریع‌تر تصمیم بگیرید.",
      },
    },

    {
      problem: {
        title: "مدیریت پراکنده فایل‌ها",
        description:
          "ثبت اطلاعات در دفتر، اکسل یا چند ابزار مختلف باعث آشفتگی و فراموش شدن پیگیری‌ها می‌شود.",
      },

      solution: {
        title: "مدیریت یکپارچه فایل‌های ملکی",
        description:
          "همه فایل‌ها، وضعیت‌ها، یادداشت‌ها و پیگیری‌ها را در یک داشبورد حرفه‌ای مدیریت کنید.",
      },
    },
  ],
};

// TODO: add more text here
