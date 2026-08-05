import React from "react";
import {
  FileText,
  ArrowRightLeft,
  Home,
  Phone,
  CalendarCheck,
  Users,
  UserCog,
  Zap,
  BarChart3,
  Search,
  LayoutDashboard,
  Monitor,
} from "lucide-react";
import {
  MotionDiv,
  MotionStagger,
  MotionItem,
  MotionHover,
} from "@/animations/MotionElements";

const features = [
  {
    icon: FileText,
    title: "مدیریت آگهی‌ها",
    description:
      "جمع‌آوری و سازماندهی آگهی‌ها از منابع مختلف در یک پنل واحد",
  },
  {
    icon: ArrowRightLeft,
    title: "تبدیل آگهی به فایل ملکی",
    description:
      "تبدیل سریع آگهی‌های جذب شده به فایل ملکی با تکمیل اطلاعات",
  },
  {
    icon: Home,
    title: "مدیریت فایل‌های ملکی",
    description:
      "ثبت، ویرایش و پیگیری همه فایل‌های ملکی به همراه جزئیات کامل",
  },
  {
    icon: Phone,
    title: "ثبت تماس",
    description:
      "ثبت خودکار و دستی تماس‌ها با مشتریان و ذخیره تاریخچه کامل",
  },
  {
    icon: CalendarCheck,
    title: "پیگیری مشتری",
    description:
      "سیستم یادآوری هوشمند برای پیگیری‌های منظم و عدم فراموشی",
  },
  {
    icon: Users,
    title: "مدیریت کاربران",
    description:
      "ایجاد و مدیریت حساب کاربری با سطوح دسترسی متفاوت",
  },
  {
    icon: UserCog,
    title: "مدیریت کارشناسان",
    description:
      "تخصیص لید و فایل به کارشناسان و نظارت بر عملکرد آن‌ها",
  },
  {
    icon: Zap,
    title: "اتصال به اسکرپر",
    description:
      "استخراج خودکار آگهی‌ها از دیوار و شیپور به صورت لحظه‌ای",
  },
  {
    icon: BarChart3,
    title: "گزارش‌گیری",
    description:
      "مشاهده آمار و گزارش‌های روزانه، هفتگی و ماهانه عملکرد",
  },
  {
    icon: Search,
    title: "جستجوی پیشرفته",
    description:
      "فیلتر و جستجوی پیشرفته در میان آگهی‌ها و فایل‌ها",
  },
  {
    icon: LayoutDashboard,
    title: "داشبورد مدیریتی",
    description:
      "نمای کلی از وضعیت لیدها، تماس‌ها و پیگیری‌ها در یک نگاه",
  },
  {
    icon: Monitor,
    title: "پنل اپراتور",
    description:
      "محیط کاربری ساده و کارآمد برای کارشناسان فروش",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="min-h-screen py-20 flex items-center justify-center bg-background"
    >
      <div className="max-w-7xl w-full mx-auto px-6">
        <MotionDiv
          delay={0.1}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-warning/10 text-warning text-lg font-semibold border border-warning/20 mb-6">
            قابلیت‌ها
          </span>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            همه ابزارهایی که
            <span className="text-primary"> نیاز دارید </span>
            در یکجا
          </h2>
          <p className="text-muted text-lg leading-8 max-w-2xl mx-auto">
            سیستم جامع مدیریت املاک با قابلیت‌های کامل برای تیم‌های فروش و مدیریت
          </p>
        </MotionDiv>

        <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <MotionItem key={index}>
                <MotionHover className="h-full">
                  <div className="bg-glass backdrop-blur-xl border border-border rounded-3xl p-6 shadow-lg h-full flex flex-col">
                    <div className="w-12 h-12 rounded-2xl text-warning bg-warning/10 flex items-center justify-center mb-4">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </MotionHover>
              </MotionItem>
            );
          })}
        </MotionStagger>
      </div>
    </section>
  );
}