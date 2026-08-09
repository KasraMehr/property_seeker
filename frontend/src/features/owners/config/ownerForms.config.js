// FILE: ownerForms.config.js
// ACTION: MUST ADD TO CONFIG

/**
 * Create / Edit Owner Form Configuration
 * Backend: OwnerCreateSerializer / OwnerUpdateSerializer
 * Fields: full_name (required), phone (required), alternate_phone, national_id, notes
 */
export const OWNER_FORM = {
  title: "پرونده مالک",
  fields: [
    {
      key: "full_name",
      label: "نام و نام خانوادگی",
      type: "text",
      required: true,
      placeholder: "مثلاً علی رضایی",
      validation: { required: "نام و نام خانوادگی الزامی است" },
      span: 6,
    },
    {
      key: "phone",
      label: "شماره تماس",
      type: "text",
      required: true,
      placeholder: "مثلاً 09123456789",
      validation: { required: "شماره تماس الزامی است" },
      span: 6,
    },
    {
      key: "alternate_phone",
      label: "شماره تماس جایگزین",
      type: "text",
      required: false,
      placeholder: "مثلاً 02188888888",
      span: 6,
    },
    {
      key: "national_id",
      label: "کد ملی",
      type: "text",
      required: false,
      placeholder: "۱۰ رقم کد ملی",
      span: 6,
    },
    {
      key: "notes",
      label: "یادداشت",
      type: "textarea",
      required: false,
      placeholder: "توضیحات یا یادداشت‌های تکمیلی...",
      rows: 4,
      span: 12,
    },
  ],
  actions: {
    submit: { label: "ذخیره اطلاعات", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};