
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
        // is_active: only editable on update (backend ignores it on create)
        {
          key: "is_active",
          label: "وضعیت فعال",
          type: "checkbox",
          required: false,
          defaultValue: true,
          condition: (values, mode) => mode === "edit",
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
          type: "search_select",
          required: true,
          placeholder: "انتخاب نقش",
          asyncSource: "/api/accounts/roles/",
          searchFields: ["name"],
          displayField: "name",
          validation: { required: "انتخاب نقش الزامی است" },
          span: 12,
        },
        // is_owner: only editable on update (backend ignores it on create)
        {
          key: "is_owner",
          label: "مالک آژانس",
          type: "checkbox",
          required: false,
          defaultValue: false,
          condition: (values, mode) => mode === "edit",
          span: 12,
        },
        // custom_permissions: backend does NOT accept this field in
        // UserCreateSerializer or UserUpdateSerializer — field is dead.
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
          placeholder: "",
          asyncSource: "/api/district/",
          searchFields: ["name"],
          displayField: "name",
          span: 12,
        },
        {
          key: "service_neighborhoods",
          label: "محله‌های خدمت",
          type: "multi_select",
          required: false,
          placeholder: "",
          asyncSource: "/api/neighborhoods/",
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
      type: "search_select",
      required: true,
      placeholder: "انتخاب نقش",
      asyncSource: "/api/accounts/roles/",
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