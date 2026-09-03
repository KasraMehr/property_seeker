import { API_ENDPOINTS } from "@/constants/apiEndpoints";

/**
 * Create / Edit Customer Form Configuration
 * Backend: CustomerCreateSerializer / CustomerUpdateSerializer
 */
export const CUSTOMER_FORM = {
  title: "پرونده مشتری",
  fields: [
    {
      key: "full_name",
      label: "نام و نام خانوادگی",
      type: "text",
      required: true,
      placeholder: "مثلاً محمد حسینی",
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
      key: "email",
      label: "پست الکترونیک",
      type: "email",
      required: false,
      placeholder: "example@domain.com",
      span: 6,
    },
    {
      key: "customer_type",
      label: "نوع مشتری",
      type: "select",
      required: true,
      placeholder: "انتخاب نوع",
      options: [
        { value: "buyer", label: "خریدار" },
        { value: "seller", label: "فروشنده" },
        { value: "tenant", label: "مستأجر" },
        { value: "landlord", label: "موجر" },
        { value: "investor", label: "سرمایه‌گذار" },
      ],
      validation: { required: "نوع مشتری الزامی است" },
      span: 6,
    },
    {
      key: "status",
      label: "وضعیت",
      type: "select",
      required: true,
      placeholder: "انتخاب وضعیت",
      options: [
        { value: "new", label: "جدید" },
        { value: "contacted", label: "تماس گرفته شده" },
        { value: "interested", label: "علاقه‌مند" },
        { value: "negotiation", label: "مذاکره" },
        { value: "closed", label: "بسته شده" },
        { value: "lost", label: "از دست رفته" },
      ],
      defaultValue: "new",
      validation: { required: "وضعیت الزامی است" },
      span: 6,
    },
    {
      key: "assigned_agent",
      label: "کارشناس مسئول",
      type: "search_select",
      required: false,
      placeholder: "انتخاب کارشناس...",
      asyncSource: API_ENDPOINTS.ACCOUNTS.USERS.LIST.url,
      searchFields: ["full_name", "phone"],
      displayField: "full_name",
      span: 6,
    },
    {
      key: "source",
      label: "منبع آگهی / جذب",
      type: "text",
      required: false,
      placeholder: "مثلاً دیوار، اینستاگرام، معرفی...",
      span: 6,
    },
    {
      key: "tags",
      label: "برچسب‌ها",
      type: "multi_select",
      required: false,
      asyncSource: API_ENDPOINTS.TAGS.LIST.url,
      displayField: "name",
      span: 6,
    },
    {
      key: "notes",
      label: "یادداشت‌ها",
      type: "textarea",
      required: false,
      placeholder: "توضیحات تکمیلی...",
      rows: 4,
      span: 12,
    },
  ],
  actions: {
    submit: { label: "ذخیره مشتری", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};

/**
 * Change Customer Status Form
 * Used in: Row action for customers
 * Backend: PATCH /api/customers/<id>/ with { status } (partial update)
 */
export const CHANGE_CUSTOMER_STATUS_FORM = {
  title: "تغییر وضعیت",
  description: "وضعیت مشتری(های) انتخاب‌شده را تغییر دهید",
  tabs: null,
  fields: [
    {
      key: "status",
      label: "وضعیت",
      type: "select",
      required: true,
      placeholder: "انتخاب وضعیت",
      options: [
        { value: "new", label: "جدید" },
        { value: "contacted", label: "تماس گرفته شده" },
        { value: "interested", label: "علاقه‌مند" },
        { value: "negotiation", label: "مذاکره" },
        { value: "closed", label: "بسته شده" },
        { value: "lost", label: "از دست رفته" },
      ],
      validation: { required: "وضعیت الزامی است" },
      span: 12,
    },
  ],
  actions: {
    submit: { label: "ذخیره تغییرات", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};