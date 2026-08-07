
/**
 * Create/Edit User Form
 * Multi-tab: basic, role_permissions, service_areas
 */
export const USER_FORM = {
  title: "کاربر",
  tabs: [
    {
      key: "basic",
      label: "اطلاعات پایه",
      icon: "User",
      fields: [
        {
          key: "full_name",
          label: "نام و نام خانوادگی",
          type: "text",
          required: true,
          placeholder: "مثلاً علی احمدی",
          validation: { required: "نام الزامی است" },
          span: 6,
        },
        {
          key: "phone",
          label: "شماره موبایل",
          type: "phone",
          required: true,
          placeholder: "۰۹۱۲۳۴۵۶۷۸۹",
          pattern: "^09\\d{9}$",
          validation: { required: "شماره موبایل الزامی است", pattern: "فرمت شماره موبایل صحیح نیست" },
          span: 6,
        },
        {
          key: "national_id",
          label: "کد ملی",
          type: "text",
          required: false,
          placeholder: "۱۰ رقم",
          pattern: "^\\d{10}$",
          validation: { pattern: "کد ملی باید ۱۰ رقم باشد" },
          span: 6,
        },
        {
          key: "email",
          label: "ایمیل",
          type: "email",
          required: false,
          placeholder: "example@mail.com",
          span: 6,
        },
        {
          key: "password",
          label: "رمز عبور",
          type: "password",
          required: true,
          placeholder: "حداقل ۸ کاراکتر",
          condition: (values, mode) => mode === "create",
          validation: { required: "رمز عبور الزامی است", minLength: "حداقل ۸ کاراکتر" },
          span: 6,
        },
        {
          key: "confirm_password",
          label: "تکرار رمز عبور",
          type: "password",
          required: true,
          placeholder: "تکرار رمز عبور",
          condition: (values, mode) => mode === "create",
          validation: { required: "تکرار رمز عبور الزامی است", match: "password" },
          span: 6,
        },
        {
          key: "is_active",
          label: "وضعیت فعال",
          type: "checkbox",
          required: false,
          defaultValue: true,
          span: 6,
        },
        {
          key: "is_staff",
          label: "دسترسی staff",
          type: "checkbox",
          required: false,
          defaultValue: false,
          permission: "change_user_is_staff",
          span: 6,
        },
        {
          key: "is_superuser",
          label: "دسترسی superuser",
          type: "checkbox",
          required: false,
          defaultValue: false,
          permission: "change_user_is_superuser",
          span: 6,
        },
      ],
    },
    {
      key: "role_permissions",
      label: "نقش و دسترسی‌ها",
      icon: "Shield",
      fields: [
        {
          key: "role",
          label: "نقش",
          type: "select",
          required: true,
          placeholder: "انتخاب نقش",
          asyncSource: "/api/roles/",
          searchFields: ["name"],
          displayField: "name",
          validation: { required: "انتخاب نقش الزامی است" },
          span: 12,
        },
        {
          key: "is_owner",
          label: "مالک آژانس",
          type: "checkbox",
          required: false,
          defaultValue: false,
          permission: "change_user_is_owner",
          span: 12,
        },
        {
          key: "custom_permissions",
          label: "دسترسی‌های سفارشی",
          type: "multi_select",
          required: false,
          placeholder: "انتخاب دسترسی‌ها",
          asyncSource: "/api/permissions/",
          searchFields: ["name", "codename"],
          displayField: "name",
          span: 12,
        },
      ],
    },
    {
      key: "service_areas",
      label: "مناطق خدمت",
      icon: "MapPin",
      fields: [
        {
          key: "service_districts",
          label: "مناطق خدمت",
          type: "multi_select",
          required: false,
          placeholder: "انتخاب مناطق",
          asyncSource: "/api/locations/districts/",
          searchFields: ["name"],
          displayField: "name",
          span: 12,
        },
        {
          key: "service_neighborhoods",
          label: "محله‌های خدمت",
          type: "multi_select",
          required: false,
          placeholder: "انتخاب محله‌ها",
          asyncSource: "/api/locations/neighborhoods/",
          searchFields: ["name"],
          displayField: "name",
          dependsOn: "service_districts",
          span: 12,
        },
      ],
    },
  ],
  actions: {
    submit: { label: "ذخیره کاربر", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};

/**
 * Change User Role Form (Bulk)
 */
export const CHANGE_USER_ROLE_FORM = {
  title: "تغییر نقش",
  description: "نقش کاربر(های) انتخاب‌شده را تغییر دهید",
  tabs: null,
  fields: [
    {
      key: "role",
      label: "نقش جدید",
      type: "select",
      required: true,
      placeholder: "انتخاب نقش",
      asyncSource: "/api/roles/",
      searchFields: ["name"],
      displayField: "name",
      validation: { required: "انتخاب نقش الزامی است" },
      span: 12,
    },
  ],
  actions: {
    submit: { label: "تغییر نقش", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};

/**
 * Toggle User Active Status Form
 */
export const TOGGLE_USER_ACTIVE_FORM = {
  title: "تغییر وضعیت فعالیت",
  description: "وضعیت فعالیت کاربر(های) انتخاب‌شده را تغییر دهید",
  tabs: null,
  fields: [
    {
      key: "is_active",
      label: "وضعیت",
      type: "select",
      required: true,
      placeholder: "انتخاب وضعیت",
      options: [
        { value: true, label: "فعال" },
        { value: false, label: "غیرفعال" },
      ],
      validation: { required: "وضعیت الزامی است" },
      span: 12,
    },
    {
      key: "note",
      label: "دلیل (اختیاری)",
      type: "textarea",
      required: false,
      placeholder: "دلیل تغییر وضعیت...",
      rows: 3,
      span: 12,
    },
  ],
  actions: {
    submit: { label: "ذخیره", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};