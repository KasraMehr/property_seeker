import { API_ENDPOINTS } from "@/constants/apiEndpoints";

/**
 * User Filters Config
 * Backend: accounts.User
 *
 * Backend UserFilter supports:
 *   role, is_active, is_owner, agency, service_neighborhood,
 *   has_permission, created_from/created_to, login_from/login_to
 *
 * Frontend quick bar: search, role, is_active
 * Frontend advanced drawer: service_neighborhood, dates
 * Note: is_owner and has_permission are backend-ready but not yet wired.
 */

export const USER_QUICK_FILTERS = [
  {
    key: "search",
    label: "جستجو",
    type: "search",
    placeholder: "نام، تلفن، کد ملی...",
    fields: ["full_name", "phone", "national_id"],
    placement: "bar",
  },
  {
    key: "role",
    label: "نقش",
    type: "multi_select",
    placeholder: "نقش",
    placement: "bar",
    async: true,
    endpoint: API_ENDPOINTS.ACCOUNTS.ROLES.LIST.url,
    optionLabel: "name",
    optionValue: "id",
    optionsKey: "roles",
  },
  {
    key: "is_active",
    label: "وضعیت",
    placeholder: "وضعیت",
    type: "select",
    placement: "bar",
    options: [
      { value: "true", label: "فعال" },
      { value: "false", label: "غیرفعال" },
    ],
  },
];

export const USER_ADVANCED_FILTERS = [
  {
    key: "service_neighborhood",
    label: "محله سرویس",
    type: "search_select",
    placement: "drawer",
    async: true,
    endpoint: API_ENDPOINTS.LOCATIONS.DIVAR_NEIGHBORHOODS.LIST.url + "?active=true",
    search_fields: ["name"],
    optionLabel: "name",
    optionValue: "id",
    optionsKey: "neighborhoods",
  },
  {
    key: "created_at",
    label: "تاریخ ثبت",
    type: "date_range",
    placement: "drawer",
    from_key: "created_from",
    to_key: "created_to",
  },
  {
    key: "last_login",
    label: "آخرین ورود",
    type: "date_range",
    placement: "drawer",
    from_key: "login_from",
    to_key: "login_to",
  },
];

export const USER_ALL_FILTERS = [
  ...USER_QUICK_FILTERS,
  ...USER_ADVANCED_FILTERS,
];

/* ─── Owner-specific filters (properties.Owner) ─── */
export const OWNER_QUICK_FILTERS = [
  {
    key: "search",
    label: "جستجو",
    type: "search",
    placeholder: "نام مالک، تلفن، کد ملی...",
    fields: ["full_name", "phone", "national_id", "alternate_phone"],
    placement: "bar",
  },
  {
    key: "agency",
    label: "آژانس",
    type: "search_select",
    placement: "bar",
    async: true,
    endpoint: API_ENDPOINTS.ACCOUNTS.AGENCIES.LIST.url,
    search_fields: ["name"],
    optionLabel: "name",
    optionValue: "id",
  },
];

export const OWNER_ADVANCED_FILTERS = [
  {
    key: "has_alternate_phone",
    label: "دارای تلفن جایگزین",
    type: "toggle",
    placement: "drawer",
    filter: (row) => !!row.alternate_phone,
  },
  {
    key: "has_national_id",
    label: "دارای کد ملی",
    type: "toggle",
    placement: "drawer",
    filter: (row) => !!row.national_id,
  },
  {
    key: "has_notes",
    label: "دارای یادداشت",
    type: "toggle",
    placement: "drawer",
    filter: (row) => !!row.notes && row.notes.length > 0,
  },
  {
    key: "created_by",
    label: "ثبت‌کننده",
    type: "search_select",
    placement: "drawer",
    async: true,
    endpoint: API_ENDPOINTS.ACCOUNTS.USERS.LIST.url,
    search_fields: ["full_name"],
    optionLabel: "full_name",
    optionValue: "id",
  },
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

export const OWNER_ALL_FILTERS = [
  ...OWNER_QUICK_FILTERS,
  ...OWNER_ADVANCED_FILTERS,
];
