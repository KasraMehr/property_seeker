// src/features/scraper-management/config/scraperTargetForms.config.js
// ============================================
// Form Configs for Scraper Management Feature
// ============================================

/**
 * Create/Edit Scraper Target Form
 * Multi-tab: basic, schedule, advanced
 */
export const SCRAPER_TARGET_FORM = {
  title: "تارگت اسکرپر",
  tabs: [
    {
      key: "basic",
      label: "اطلاعات پایه",
      icon: "Globe",
      fields: [
        {
          key: "name",
          label: "نام تارگت",
          type: "text",
          required: true,
          placeholder: "مثلاً دیوار-کرج-فروش",
          validation: { required: "نام تارگت الزامی است" },
          span: 12,
        },
        {
          key: "search_url",
          label: "آدرس URL",
          type: "url",
          required: true,
          placeholder: "https://divar.ir/s/...",
          validation: { required: "URL الزامی است" },
          span: 12,
        },
        {
          key: "source",
          label: "منبع",
          type: "select",
          required: true,
          options: [{ value: 1, label: "دیوار" }], 
          validation: { required: "منبع الزامی است" },
          span: 6,
        },
        {
          key: "enabled",
          label: "فعال",
          type: "checkbox",
          required: false,
          defaultValue: true,
          span: 6,
        },
      ],
    },
    {
      key: "schedule",
      label: "زمان‌بندی",
      icon: "Clock",
      fields: [
        {
          key: "discovery_interval_minutes",
          label: "فاصله اجرا (دقیقه)",
          type: "number",
          required: true,
          placeholder: "مثلاً ۶۰",
          min: 5,
          defaultValue: 60,
          validation: {
            required: "فاصله اجرا الزامی است",
            min: "حداقل ۵ دقیقه",
          },
          span: 6,
        },
      ],
    },
    {
      key: "advanced",
      label: "تنظیمات پیشرفته",
      icon: "Settings",
      fields: [
        {
          key: "incremental_max_cards",
          label: "حداکثر کارت‌های افزایشی",
          type: "number",
          required: false,
          placeholder: "مثلاً ۵۰",
          min: 1,
          span: 6,
        },
        {
          key: "incremental_known_streak",
          label: "استریک شناخته‌شده",
          type: "number",
          required: false,
          placeholder: "مثلاً ۳",
          min: 1,
          span: 6,
        },
      ],
    },
  ],
  actions: {
    submit: { label: "ذخیره تارگت", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};

/**
 * Trigger Scraper Run Form (manual run)
 */
export const TRIGGER_SCRAPER_RUN_FORM = {
  title: "اجرای دستی اسکرپر",
  description: "اجرای دستی تارگت انتخاب‌شده",
  tabs: null,
  fields: [
    {
      key: "mode",
      label: "حالت اجرا",
      type: "select",
      required: true,
      placeholder: "انتخاب حالت",
      options: [
        { value: "full", label: "کامل" },
        { value: "discovery", label: "کشف جدید" },
        { value: "reconciliation", label: "تطبیق" },
      ],
      defaultValue: "discovery",
      validation: { required: "حالت اجرا الزامی است" },
      span: 12,
    },
    {
      key: "note",
      label: "یادداشت",
      type: "textarea",
      required: false,
      placeholder: "توضیحات اجرای دستی...",
      rows: 3,
      span: 12,
    },
  ],
  actions: {
    submit: { label: "اجرا", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};
