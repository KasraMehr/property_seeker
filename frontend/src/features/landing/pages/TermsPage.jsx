import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import PublicPageLayout from "../../../shared/layout/PublicPageLayout";

const sections = [
  {
    title: "ثبت و ارائه فایل",
    text: "ثبت‌کننده فایل متعهد است اطلاعات ملک، مالکیت، قیمت، شرایط معامله و مدارک ارائه‌شده را صحیح و واقعی اعلام کند. مسئولیت هرگونه اطلاعات خلاف واقع بر عهده ارائه‌دهنده فایل است.",
  },
  {
    title: "مالکیت و اختیار قانونی",
    text: "ثبت فایل به منزله تأیید مالکیت توسط دیلان ملک نیست. مالک یا نماینده وی باید اختیار قانونی لازم برای فروش، اجاره، مشارکت، تهاتر یا واگذاری ملک را داشته باشد.",
  },
  {
    title: "بازاریابی و انتشار فایل",
    text: "با ثبت فایل، ارائه‌دهنده با معرفی و بازاریابی اطلاعات مربوط به ملک توسط دیلان ملک در وب‌سایت، شبکه‌های اجتماعی، پلتفرم‌های تبلیغاتی و سایر رسانه‌های مجاز موافقت می‌کند.\n\nدیلان ملک می‌تواند برای حفظ محرمانگی، بخشی از اطلاعات مالک یا موقعیت دقیق ملک را تا زمان مناسب منتشر نکند.",
  },
  {
    title: "فایل‌های دفاتر املاک و همکاران",
    text: "در صورت دریافت فایل از دفاتر املاک یا مشاوران همکار، مسئولیت صحت اطلاعات اولیه و اختیار ارائه فایل بر عهده ارائه‌دهنده فایل است. نحوه همکاری، معرفی مشتری و تقسیم حق‌الزحمه مطابق توافق جداگانه میان طرفین خواهد بود.",
  },
  {
    title: "معاملات تهاتری و مشارکتی",
    text: "در فایل‌های تهاتر، مشارکت در ساخت، معاوضه و سایر معاملات خاص، شرایط معامله باید به‌صورت کامل و شفاف اعلام شود. انجام معامله منوط به بررسی مدارک، احراز اختیار طرفین و بررسی حقوقی و قراردادی است.",
  },
  {
    title: "بررسی حقوقی ملک",
    text: "دیلان ملک در حوزه معرفی و بازاریابی فعالیت می‌کند و ثبت یا انتشار یک فایل به معنی تأیید مالکیت، اصالت اسناد، کاربری، عدم وجود معارض، بدهی، بازداشت، رهن یا سایر وضعیت‌های حقوقی ملک نیست.\n\nپیش از انجام معامله، طرفین باید مدارک و وضعیت حقوقی ملک را از طریق مراجع ذی‌صلاح و در صورت نیاز با استفاده از خدمات کارشناسان و مشاوران حقوقی بررسی کنند.",
  },
  {
    title: "مسئولیت طرفین معامله",
    text: "مسئولیت نهایی تصمیم‌گیری و انجام معامله بر عهده طرفین معامله است. دیلان ملک مسئولیتی در قبال اطلاعاتی که توسط مالک، فروشنده، خریدار، مشاور یا سایر اشخاص ارائه شده و خارج از کنترل دیلان ملک است، نخواهد داشت.",
  },
  {
    title: "حذف یا غیرفعال کردن فایل",
    text: "دیلان ملک در صورت مشاهده اطلاعات ناقص یا خلاف واقع، عدم همکاری، درخواست مالک، فروش یا واگذاری ملک، وجود مشکل قانونی یا هر دلیل موجه دیگر، حق دارد فایل را بدون اطلاع قبلی حذف یا غیرفعال کند.",
  },
  {
    title: "حفظ محرمانگی",
    text: "اطلاعات شخصی کاربران و اطلاعات محرمانه فایل‌ها مطابق سیاست حریم خصوصی دیلان ملک نگهداری می‌شود و جز در موارد ضروری برای ارائه خدمات، با رضایت کاربر یا به حکم قانون در اختیار اشخاص دیگر قرار نمی‌گیرد.",
  },
  {
    title: "کمیسیون و حق‌الزحمه",
    text: "هرگونه کمیسیون، حق بازاریابی یا حق‌الزحمه دیلان ملک و نحوه پرداخت آن، حسب نوع همکاری و قرارداد مربوطه تعیین می‌شود. ثبت فایل به‌تنهایی ایجاد تعهد برای پرداخت کمیسیون نمی‌کند، مگر آنکه شرایط آن قبلاً به‌صورت کتبی توافق شده باشد.",
  },
  {
    title: "ممنوعیت سوءاستفاده از اطلاعات",
    text: "استفاده از اطلاعات فایل‌ها برای کپی‌برداری، انتشار بدون مجوز، فریب، قیمت‌سازی، ایجاد معامله صوری یا دور زدن حقوق قراردادی دیلان ملک یا همکاران آن ممنوع است و می‌تواند موجب پیگیری قانونی شود.",
  },
  {
    title: "پذیرش قوانین",
    text: "کاربر با ثبت فایل، ارسال درخواست یا استفاده از خدمات دیلان ملک تأیید می‌کند که این قوانین را مطالعه کرده و می‌پذیرد.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function TermsPage() {
  return (
    <PublicPageLayout>
      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold"> قوانین و شرایط استفاده از خدمات دیلان ملک</h1>
        </div>
        <div className="w-12 h-1 bg-primary rounded-full" />
      </motion.div>

      {/* Intro */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-sm text-muted leading-7 mb-2"
      >
        آخرین به‌روزرسانی: ۱۰ شهریور ۱۴۰۵ — ۱ سپتامبر ۲۰۲۶
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="text-sm text-muted leading-7 mb-8"
      >
        استفاده از وب‌سایت، ثبت فایل و دریافت خدمات از دیلان ملک به منزله
        مطالعه و پذیرش قوانین زیر است.
      </motion.p>

      {/* Sections */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {sections.map((section, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="p-6 rounded-2xl border border-border bg-surface/40 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                {index + 1}
              </span>
              <h2 className="text-base font-bold">{section.title}</h2>
            </div>
            <div className="pr-9">
              {section.text.split("\n\n").map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className="text-sm text-muted leading-7 last:mb-0 mb-3"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="mt-12 pt-8 border-t border-border text-center"
      >
        <p className="text-2xl text-(--primary) font-bold mb-2">دیلان ملک</p>
        <p className="text-base text-muted leading-8">
          شفافیت در معرفی، دقت در اطلاعات، احترام به حقوق طرفین
        </p>
      </motion.div>
    </PublicPageLayout>
  );
}
