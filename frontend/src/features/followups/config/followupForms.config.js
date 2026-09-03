import { API_ENDPOINTS } from "@/constants/apiEndpoints";

/**
 * Create/Edit Followup Form
 */
export const FOLLOWUP_FORM = {
  title: "وظیفه / پیگیری",
  tabs: [
    {
      key: "basic",
      label: "اطلاعات پیگیری",
      icon: "ClipboardList",
      fields: [
        {
          key: "title",
          label: "عنوان",
          type: "text",
          required: true,
          placeholder: "مثلاً پیگیری قیمت با مالک",
          validation: { required: "عنوان الزامی است" },
          span: 12,
        },
        {
          key: "type",
          label: "نوع پیگیری",
          type: "select",
          required: true,
          placeholder: "انتخاب نوع",
          options: [
            { value: "call", label: "تماس" },
            { value: "visit", label: "بازدید" },
            { value: "follow_up", label: "پیگیری" },
            { value: "other", label: "سایر" },
          ],
          defaultValue: "follow_up",
          validation: { required: "نوع پیگیری الزامی است" },
          span: 6,
        },
        {
          key: "status",
          label: "وضعیت",
          type: "select",
          required: true,
          placeholder: "انتخاب وضعیت",
          options: [
            { value: "pending", label: "در انتظار" },
            { value: "done", label: "انجام شده" },
            { value: "canceled", label: "لغو شده" },
          ],
          defaultValue: "pending",
          validation: { required: "وضعیت الزامی است" },
          span: 6,
        },
        {
          key: "user",
          label: "مسئول پیگیری",
          type: "search_select",
          required: true,
          placeholder: "جستجوی کاربر...",
          asyncSource: `${API_ENDPOINTS.ACCOUNTS.USERS.LIST.url}?is_active=true`,
          searchFields: ["full_name", "phone"],
          displayField: "full_name",
          validation: { required: "انتخاب مسئول الزامی است" },
          span: 6,
        },
        {
          key: "due_at",
          label: "موعد انجام",
          type: "datetime",
          required: true,
          placeholder: "انتخاب تاریخ و زمان",
          validation: { required: "موعد انجام الزامی است" },
          span: 6,
        },
        {
          key: "customer",
          label: "مشتری مرتبط",
          type: "search_select",
          required: false,
          placeholder: "جستجوی مشتری...",
          asyncSource: API_ENDPOINTS.CUSTOMERS.LIST.url,
          searchFields: ["full_name", "phone"],
          displayField: "full_name",
          span: 6,
        },
        {
          key: "property",
          label: "ملک مرتبط",
          type: "search_select",
          required: false,
          placeholder: "جستجوی ملک...",
          asyncSource: API_ENDPOINTS.PROPERTIES.LIST.url,
          searchFields: ["title", "property_code"],
          displayField: "title",
          span: 6,
        },
        {
          key: "description",
          label: "توضیحات",
          type: "textarea",
          required: false,
          placeholder: "جزئیات پیگیری...",
          rows: 4,
          span: 12,
        },
      ],
    },
    {
      key: "completion",
      label: "تکمیل",
      icon: "CheckCircle",
      condition: (values) => values.status === "done",
      fields: [
        {
          key: "completed_at",
          label: "تاریخ تکمیل",
          type: "datetime",
          required: false,
          defaultValue: "now",
          span: 6,
        },
      ],
    },
  ],
  actions: {
    submit: { label: "ذخیره پیگیری", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};


