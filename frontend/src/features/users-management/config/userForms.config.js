import { API_ENDPOINTS } from "@/constants/apiEndpoints";

/**
 * Create / Edit User Form
 *
 * Backend source of truth (serializers):
 *
 * User:
 *   full_name, phone, national_id, password,
 *   role, service_neighborhoods, is_owner, is_active
 *
 * Backend mappings:
 *   role                  -> Role (PK on write, array on read)
 *   service_neighborhoods -> DivarNeighborhood (PK[], only active)
 *
 * Frontend-only fields (stripped in UserFormModal before submit):
 *   confirm_password
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
          validation: {
            required: "نام الزامی است",
          },
          span: 6,
        },

        {
          key: "phone",
          label: "شماره موبایل",
          type: "phone",
          required: true,
          placeholder: "۰۹۱۲۳۴۵۶۷۸۹",
          pattern: "^09\\d{9}$",
          validation: {
            required: "شماره موبایل الزامی است",
            pattern: "فرمت شماره موبایل صحیح نیست",
          },
          autoComplete: "tel",
          span: 6,
        },

        {
          key: "national_id",
          label: "کد ملی",
          type: "text",
          required: true,
          placeholder: "۱۰ رقم",
          pattern: "^\\d{10}$",
          validation: {
            required: "کد ملی الزامی است",
            pattern: "کد ملی باید ۱۰ رقم باشد",
          },
          autoComplete: "off",
          span: 6,
        },

        {
          key: "password",
          label: "رمز عبور",
          type: "password",
          required: true,
          placeholder: "حداقل ۸ کاراکتر",
          condition: (values, mode) => mode === "create",
          validation: {
            required: "رمز عبور الزامی است",
            minLength: "حداقل ۸ کاراکتر",
          },
          autoComplete: "new-password",
          span: 6,
        },

        {
          /**
           * Frontend-only field.
           *
           * This field MUST be removed from the payload
           * in UserFormModal before calling the backend.
           */
          key: "confirm_password",
          label: "تکرار رمز عبور",
          type: "password",
          required: true,
          placeholder: "تکرار رمز عبور",
          condition: (values, mode) => mode === "create",
          validation: {
            required: "تکرار رمز عبور الزامی است",
            match: "password",
          },
          autoComplete: "new-password",
          span: 6,
        },

        {
          /**
           * Backend supports this on update.
           */
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
          asyncSource: API_ENDPOINTS.ACCOUNTS.ROLES.LIST.url,
          searchFields: ["name"],
          displayField: "name",
          validation: {
            required: "انتخاب نقش الزامی است",
          },
          span: 12,
        },

        {
          /**
           * Only editable on update.
           */
          key: "is_owner",
          label: "مالک آژانس",
          type: "checkbox",
          required: false,
          defaultValue: false,
          condition: (values, mode) => mode === "edit",
          span: 12,
        },
      ],
    },

    {
      key: "service_neighborhoods",
      label: "محله‌های خدمت",
      icon: "MapPin",

      fields: [
        {
          key: "service_neighborhoods",
          label: "محله‌های سرویس",
          type: "multi_select",
          required: false,
          placeholder: "",

          asyncSource: API_ENDPOINTS.LOCATIONS.DIVAR_NEIGHBORHOODS.LIST.url,

          searchFields: ["name", "zone_name", "city_name"],

          displayField: "name",

          span: 12,
        },
      ],
    },
  ],

  actions: {
    submit: {
      label: "ذخیره کاربر",
      variant: "primary",
    },

    cancel: {
      label: "انصراف",
      variant: "ghost",
    },
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

      asyncSource: API_ENDPOINTS.ACCOUNTS.ROLES.LIST.url,

      searchFields: ["name"],
      displayField: "name",

      validation: {
        required: "انتخاب نقش الزامی است",
      },

      span: 12,
    },
  ],

  actions: {
    submit: {
      label: "تغییر نقش",
      variant: "primary",
    },

    cancel: {
      label: "انصراف",
      variant: "ghost",
    },
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
        {
          value: true,
          label: "فعال",
        },
        {
          value: false,
          label: "غیرفعال",
        },
      ],

      validation: {
        required: "وضعیت الزامی است",
      },

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
    submit: {
      label: "ذخیره",
      variant: "primary",
    },

    cancel: {
      label: "انصراف",
      variant: "ghost",
    },
  },
};
