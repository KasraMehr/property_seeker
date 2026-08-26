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