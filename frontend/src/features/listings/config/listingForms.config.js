import { API_ENDPOINTS } from "@/constants/apiEndpoints";

/**
 * Change Review Status Form
 * Used in: Row action / Bulk action for listings
 */
export const CHANGE_REVIEW_STATUS_FORM = {
  title: "تغییر وضعیت بررسی",
  description: "وضعیت بررسی آگهی(های) انتخاب‌شده را تغییر دهید",
  tabs: null,
  fields: [
    {
      key: "review_status",
      label: "وضعیت بررسی",
      type: "select",
      required: true,
      placeholder: "انتخاب وضعیت",
      options: [
        { value: "unreviewed", label: "بررسی نشده" },
        { value: "shortlisted", label: "کوت‌لیست" },
        { value: "promoted", label: "تبدیل به ملک" },
        { value: "rejected", label: "رد شده" },
        { value: "archived", label: "آرشیو" },
      ],
      validation: { required: "وضعیت بررسی الزامی است" },
      span: 12,
    },
  ],
  actions: {
    submit: { label: "ذخیره تغییرات", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};

/**
 * Assign Operator Form
 * Used in: Row action for listings (assign to operator)
 */
export const ASSIGN_OPERATOR_FORM = {
  title: "تخصیص به اپراتور",
  description: "آگهی را به اپراتور مورد نظر اختصاص دهید",
  tabs: null,
  fields: [
    {
      key: "operator",
      label: "اپراتور",
      type: "search_select",
      required: true,
      placeholder: "جستجوی اپراتور...",
      asyncSource: `${API_ENDPOINTS.ACCOUNTS.USERS.LIST.url}?role=operator&is_active=true`,
      searchFields: ["full_name", "phone"],
      displayField: "full_name",
      validation: { required: "انتخاب اپراتور الزامی است" },
      span: 12,
    },
    {
      key: "priority",
      label: "اولویت",
      type: "select",
      required: false,
      placeholder: "انتخاب اولویت",
      options: [
        { value: "high", label: "بالا" },
        { value: "medium", label: "متوسط" },
        { value: "low", label: "پایین" },
      ],
      defaultValue: "medium",
      span: 12,
    },
    {
      key: "note",
      label: "یادداشت",
      type: "textarea",
      required: false,
      placeholder: "توضیحات اختصاص لید...",
      rows: 3,
      span: 12,
    },
  ],
  actions: {
    submit: { label: "تخصیص", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};

/**
 * Register Call from Listing Form
 * Used in: Listing detail → Register Call action
 * Auto-fills: customer, related_listing, agency
 */
export const REGISTER_CALL_FROM_LISTING_FORM = {
  title: "ثبت تماس",
  description: "تماس جدید مرتبط با این آگهی",
  tabs: null, 
  fields: [
    {
      key: "customer",
      label: "مشتری",
      type: "search_select",
      required: true,
      placeholder: "جستجوی مشتری...",
      asyncSource: API_ENDPOINTS.CUSTOMERS.LIST.url,
      searchFields: ["full_name", "phone"],
      displayField: "full_name",
      validation: { required: "انتخاب مشتری الزامی است" },
      span: 12,
    },
    {
      key: "call_type",
      label: "نوع تماس",
      type: "select",
      required: true,
      options: [
        { value: "incoming", label: "ورودی" },
        { value: "outgoing", label: "خروجی" },
      ],
      defaultValue: "outgoing",
      validation: { required: "نوع تماس الزامی است" },
      span: 6,
    },
    {
      key: "called_at",
      label: "زمان تماس",
      type: "datetime",
      required: true,
      validation: { required: "زمان تماس الزامی است" },
      span: 6,
    },
    {
      key: "result",
      label: "نتیجه تماس",
      type: "select",
      required: true,
      options: [
        { value: "answered", label: "پاسخ داده شد" },
        { value: "no_answer", label: "پاسخ نداد" },
        { value: "busy", label: "مشغول" },
        { value: "interested", label: "علاقه‌مند" },
        { value: "not_interested", label: "عدم تمایل" },
        { value: "follow_up", label: "نیاز به پیگیری" },
        { value: "visit_booked", label: "بازدید ثبت شد" },
      ],
      validation: { required: "نتیجه تماس الزامی است" },
      span: 6,
    },
    {
      key: "call_duration",
      label: "مدت تماس (ثانیه)",
      type: "number",
      required: false,
      min: 0,
      defaultValue: 0,
      placeholder: "مثلاً ۱۲۰",
      span: 6,
    },
    {
      key: "note",
      label: "یادداشت",
      type: "textarea",
      required: false,
      rows: 3,
      placeholder: "جزئیات تماس...",
      span: 12,
    },
    {
      key: "next_follow_up_at",
      label: "پیگیری بعدی",
      type: "datetime",
      required: false,
      span: 6,
    },
    {
      key: "follow_up_done",
      label: "پیگیری انجام شد",
      type: "checkbox",
      required: false,
      defaultValue: false,
      span: 6,
    },
    {
      key: "record_file",
      label: "فایل صوتی (اختیاری)",
      type: "file",
      required: false,
      accept: "audio/*",
      span: 12,
    },
  ],
  actions: {
    submit: { label: "ثبت تماس", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};

/**
 * Create/Edit Listing Form (Admin only — manual entry)
 */
export const LISTING_FORM = {
  title: "آگهی",
  tabs: [
    {
      key: "basic",
      label: "اطلاعات پایه",
      icon: "FileText",
      fields: [
        { key: "title", label: "عنوان", type: "text", required: true, span: 12 },
        { key: "external_id", label: "شناسه خارجی", type: "text", required: false, span: 6 },
        // NOTE: No backend endpoint for listing sources exists yet (Source model has no list view)
        { key: "source", label: "منبع", type: "select", required: true, options: [], span: 6 },
        { key: "url", label: "لینک منبع", type: "url", required: false, span: 12 },
        { key: "deal_type", label: "نوع معامله", type: "select", required: true, options: [
          { value: "sale", label: "فروش" },
          { value: "rent", label: "اجاره" },
          { value: "presale", label: "پیش‌فروش" },
        ], span: 6 },
        { key: "status", label: "وضعیت آگهی", type: "select", required: true, options: [
          { value: "active", label: "فعال" },
          { value: "inactive", label: "غیرفعال" },
          { value: "expired", label: "منقضی" },
        ], span: 6 },
      ],
    },
    {
      key: "details",
      label: "جزئیات ملک",
      icon: "Building",
      fields: [
        { key: "price", label: "قیمت (تومان)", type: "price", required: false, span: 6 },
        { key: "area", label: "متراژ", type: "number", required: false, span: 6 },
        { key: "age", label: "سال ساخت", type: "number", required: false, min: 1300, max: 1500, span: 6 },
        { key: "bedrooms", label: "تعداد اتاق", type: "number", required: false, span: 6 },
        { key: "floor", label: "شماره طبقه", type: "number", required: false, span: 6 },
        { key: "total_floors", label: "تعداد طبقات", type: "number", required: false, span: 6 },
        { key: "description", label: "توضیحات", type: "textarea", required: false, rows: 4, span: 12 },
      ],
    },
  ],
  actions: {
    submit: { label: "ذخیره", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};