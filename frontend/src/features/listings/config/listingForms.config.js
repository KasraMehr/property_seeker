
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
    {
      key: "note",
      label: "یادداشت (اختیاری)",
      type: "textarea",
      required: false,
      placeholder: "دلیل تغییر وضعیت...",
      rows: 3,
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
      asyncSource: "/api/users/?role=operator&is_active=true",
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
  description: "تماس جدید ثبت کنید — بخشی از اطلاعات از آگهی پر شده است",
  tabs: [
    {
      key: "basic",
      label: "اطلاعات تماس",
      icon: "Phone",
      fields: [
        {
          key: "customer",
          label: "مشتری / تماس‌گیرنده",
          type: "search_select",
          required: true,
          placeholder: "جستجوی مشتری...",
          asyncSource: "/api/customers/",
          searchFields: ["full_name", "phone", "national_id"],
          displayField: "full_name",
          autoFill: { source: "listing", field: "owner_snapshot", readOnly: false },
          validation: { required: "انتخاب مشتری الزامی است" },
          span: 12,
        },
        {
          key: "call_type",
          label: "نوع تماس",
          type: "select",
          required: true,
          placeholder: "انتخاب نوع",
          options: [
            { value: "inbound", label: "ورودی" },
            { value: "outbound", label: "خروجی" },
            { value: "missed", label: "از دست رفته" },
            { value: "follow_up", label: "پیگیری" },
          ],
          defaultValue: "outbound",
          validation: { required: "نوع تماس الزامی است" },
          span: 6,
        },
        {
          key: "called_at",
          label: "زمان تماس",
          type: "datetime",
          required: true,
          defaultValue: "now",
          validation: { required: "زمان تماس الزامی است" },
          span: 6,
        },
        {
          key: "related_listing",
          label: "آگهی مرتبط",
          type: "nested_display",
          required: false,
          autoFill: { source: "listing", field: "id", readOnly: true },
          displayTemplate: "{title} — {external_id}",
          span: 12,
        },
        {
          key: "duration",
          label: "مدت تماس (ثانیه)",
          type: "number",
          required: false,
          placeholder: "مثلاً ۱۲۰",
          min: 0,
          span: 6,
        },
        {
          key: "record_file",
          label: "فایل صوتی",
          type: "file",
          required: false,
          accept: "audio/*",
          span: 6,
        },
      ],
    },
    {
      key: "result",
      label: "نتیجه",
      icon: "CheckCircle",
      fields: [
        {
          key: "result",
          label: "نتیجه تماس",
          type: "select",
          required: true,
          placeholder: "انتخاب نتیجه",
          options: [
            { value: "answered", label: "پاسخ داده" },
            { value: "no_answer", label: "بدون پاسخ" },
            { value: "busy", label: "مشغول" },
            { value: "interested", label: "علاقه‌مند" },
            { value: "not_interested", label: "عدم علاقه" },
            { value: "follow_up", label: "نیاز به پیگیری" },
            { value: "visit_booked", label: "قرار بازدید" },
          ],
          validation: { required: "نتیجه تماس الزامی است" },
          span: 12,
        },
        {
          key: "note",
          label: "یادداشت",
          type: "textarea",
          required: false,
          placeholder: "جزئیات تماس...",
          rows: 4,
          span: 12,
        },
      ],
    },
    {
      key: "followup",
      label: "پیگیری بعدی",
      icon: "CalendarClock",
      condition: (values) => ["follow_up", "interested", "visit_booked"].includes(values.result),
      fields: [
        {
          key: "next_follow_up_at",
          label: "تاریخ پیگیری بعدی",
          type: "datetime",
          required: false,
          placeholder: "انتخاب تاریخ",
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
          key: "follow_up_note",
          label: "توضیحات پیگیری",
          type: "textarea",
          required: false,
          placeholder: "جزئیات پیگیری بعدی...",
          rows: 3,
          span: 12,
        },
      ],
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
        { key: "source", label: "منبع", type: "select", required: true, options: [], asyncSource: "/api/listing/sources/", span: 6 },
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