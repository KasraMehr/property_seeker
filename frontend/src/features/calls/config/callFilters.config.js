import { CALL_RESULT_CONFIG, CALL_TYPE_CONFIG } from "@/features/calls/config";

import { API_ENDPOINTS } from "@/constants/apiEndpoints";

/**
 * Call Log Filters Config
 * Backend: crm.CallLog
 *
 * Quick: search, call_type, result, handled_by, date
 * Advanced: customer, customer_type, property/listing, follow_up, duration
 */

export const CALL_QUICK_FILTERS = [
  {
    key: "search",
    label: "جستجو",
    type: "search",
    placeholder: "نام مشتری، یادداشت، شماره...",
    fields: ["customer.full_name", "customer.phone", "note"],
    placement: "bar",
  },

  {
    key: "call_type",
    label: "نوع تماس",
    type: "multi_select",
    placement: "bar",
    options: Object.entries(CALL_TYPE_CONFIG).map(([value, cfg]) => ({
      value,
      label: cfg.label,
    })),
  },

  {
    key: "result",
    label: "نتیجه",
    type: "multi_select",
    placement: "bar",
    options: Object.entries(CALL_RESULT_CONFIG).map(([value, cfg]) => ({
      value,
      label: cfg.label,
    })),
  },

  {
    key: "handled_by",
    label: "اپراتور",
    type: "search_select",
    placement: "bar",
    async: true,
    endpoint: API_ENDPOINTS.ACCOUNTS.USERS.LIST.url,
    search_fields: ["full_name", "phone"],
    optionLabel: "full_name",
    optionValue: "id",
  },

  {
    key: "customer",
    label: "مشتری",
    type: "search_select",
    placement: "drawer",
    async: true,
    endpoint: API_ENDPOINTS.CUSTOMERS.LIST.url,
    search_fields: ["full_name", "phone", "national_id"],
    optionLabel: "full_name",
    optionValue: "id",
  },
];

export const CALL_ADVANCED_FILTERS = [
  {
    key: "customer_type",
    label: "نوع مشتری",
    type: "multi_select",
    placement: "drawer",
    options: [
      { value: "buyer", label: "خریدار" },
      { value: "seller", label: "فروشنده" },
      { value: "tenant", label: "مستأجر" },
      { value: "landlord", label: "موجر" },
      { value: "investor", label: "سرمایه‌گذار" },
    ],
  },

  {
    key: "called_at",
    label: "زمان تماس",
    type: "date_range",
    placement: "bar",
    from_key: "called_from",
    to_key: "called_to",
  },

  // {
  //   key: "property",
  //   label: "ملک",
  //   type: "search_select",
  //   placement: "drawer",
  //   async: true,
  //   endpoint: "/api/property/list",
  //   search_fields: ["title", "property_code"],
  //   optionLabel: "title",
  //   optionValue: "id",
  // },

  // {
  //   key: "listing",
  //   label: "آگهی",
  //   type: "search_select",
  //   placement: "drawer",
  //   async: true,
  //   endpoint: "/api/listing/list/",
  //   search_fields: ["title", "external_id"],
  //   optionLabel: "title",
  //   optionValue: "id",
  // },

  // {
  //   key: "property",
  //   label: "ملک",
  //   type: "search_select",
  //   placement: "drawer",
  //   async: true,
  //   endpoint: "/api/property/list",
  //   search_fields: ["title", "property_code"],
  //   optionLabel: "title",
  //   optionValue: "id",
  // },

  // {
  //   key: "listing",
  //   label: "آگهی",
  //   type: "search_select",
  //   placement: "drawer",
  //   async: true,
  //   endpoint: "/api/listing/list/",
  //   search_fields: ["title", "external_id"],
  //   optionLabel: "title",
  //   optionValue: "id",
  // },

  {
    key: "property",
    label: "ملک",
    type: "search_select",
    placement: "drawer",
    async: true,
    endpoint: API_ENDPOINTS.PROPERTIES.LIST.url,
    search_fields: ["title", "property_code"],
    optionLabel: "title",
    optionValue: "id",
  },

  {
    key: "listing",
    label: "آگهی",
    type: "search_select",
    placement: "drawer",
    async: true,
    endpoint: API_ENDPOINTS.LISTINGS.LIST.url,
    search_fields: ["title", "external_id"],
    optionLabel: "title",
    optionValue: "id",
  },

  {
    key: "has_follow_up",
    label: "نیاز به پیگیری",
    type: "toggle",
    placement: "drawer",
    filter: (row) => row.next_follow_up_at && !row.follow_up_done,
  },

  {
    key: "follow_up_done",
    label: "پیگیری انجام‌شده",
    type: "toggle",
    placement: "drawer",
  },

  {
    key: "has_next_follow_up",
    label: "دارای پیگیری بعدی",
    type: "toggle",
    placement: "drawer",
    filter: (row) => !!row.next_follow_up_at,
  },

  {
    key: "call_duration",
    label: "مدت تماس",
    type: "range",
    placement: "drawer",
    min: 0,
    max: 3600,
    min_key: "duration_min",
    max_key: "duration_max",
    step: 10,
    unit: "ثانیه",
  },

  {
    key: "has_record",
    label: "دارای فایل صوتی",
    type: "toggle",
    placement: "drawer",
    filter: (row) => !!row.record_file,
  },
  {
    key: "is_deleted",
    label: "حذف‌شده",
    type: "toggle",
    placement: "drawer",
  },

  {
    key: "created_at",
    label: "تاریخ ثبت",
    type: "date_range",
    placement: "drawer",
    from_key: "created_from",
    to_key: "created_to",
  },
];

export const CALL_ALL_FILTERS = [
  ...CALL_QUICK_FILTERS,
  ...CALL_ADVANCED_FILTERS,
];
