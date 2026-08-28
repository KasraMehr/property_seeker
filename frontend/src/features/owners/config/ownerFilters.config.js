import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const OWNER_QUICK_FILTERS = [
  {
    key: "search",
    label: "جستجو",
    type: "search",
    placeholder: "نام، شماره تماس، کد ملی...",
    fields: ["full_name", "phone", "national_id", "alternate_phone"],
    placement: "bar",
  },
  {
    key: "has_alternate_phone",
    label: "دارای شماره تماس جایگزین",
    type: "toggle",
    placement: "drawer",
  },
  // {
  //   key: "has_national_id",
  //   label: "دارای کد ملی",
  //   type: "toggle",
  //   placement: "drawer",
  // },
  {
    key: "has_notes",
    label: "دارای یادداشت",
    type: "toggle",
    placement: "drawer",
  },
  {
    key: "created_by",
    label: "ثبت‌کننده",
    type: "search_select",
    placement: "drawer",
    async: true,
    endpoint: API_ENDPOINTS.ACCOUNTS.USERS.LIST.url,
    search_fields: ["full_name", "phone"],
    optionLabel: "full_name",
    optionValue: "id",
  },
];

export const OWNER_ADVANCED_FILTERS = [
  
  
  {
    key: "created_at",
    label: "تاریخ ثبت",
    type: "date_range",
    placement: "drawer",
    from_key: "created_from",
    to_key: "created_to",
  },
  {
    key: "updated_at",
    label: "آخرین بروزرسانی",
    type: "date_range",
    placement: "drawer",
    from_key: "updated_from",
    to_key: "updated_to",
  },
];

export const OWNER_ALL_FILTERS = [...OWNER_QUICK_FILTERS, ...OWNER_ADVANCED_FILTERS];