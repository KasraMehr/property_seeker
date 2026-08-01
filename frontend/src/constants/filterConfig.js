/**
 * Filter schema — backend-driven config
 * Backend can send this JSON, frontend renders dynamically.
 */
export const FILTER_TYPES = {
  SEARCH: "search",
  SELECT: "select",
  MULTI_SELECT: "multiselect",
  RANGE: "range",
  DATE_RANGE: "date_range",
  TOGGLE: "toggle",
};

/**
 * Predefined option sets (can come from API)
 */
export const FILTER_OPTIONS = {
  listingStatus: [
    { value: "active", label: "فعال" },
    { value: "draft", label: "پیش‌نویس" },
    { value: "expired", label: "منقضی" },
    { value: "sold", label: "فروخته شده" },
    { value: "rented", label: "اجاره رفته" },
  ],
  source: [
    { value: "divar", label: "دیوار" },
    { value: "sheypoor", label: "شیپور" },
    { value: "internal", label: "داخلی" },
  ],
  district: [
    { value: "1", label: "منطقه ۱ کرج" },
    { value: "2", label: "منطقه ۲ کرج" },
    { value: "3", label: "منطقه ۳ کرج" },
    { value: "4", label: "منطقه ۴ کرج" },
    { value: "5", label: "منطقه ۵ کرج" },
    { value: "6", label: "منطقه ۶ کرج" },
    { value: "10", label: "منطقه ۱۰ کرج" },
  ],
  rooms: [
    { value: "1", label: "۱ خواب" },
    { value: "2", label: "۲ خواب" },
    { value: "3", label: "۳ خواب" },
    { value: "4", label: "۴ خواب" },
  ],
  userRole: [
    { value: "admin", label: "مدیر" },
    { value: "operator", label: "اپراتور" },
  ],
  userStatus: [
    { value: "true", label: "فعال" },
    { value: "false", label: "غیرفعال" },
  ],
};

/**
 * Filter schemas per page/resource
 * Backend can send this via API: GET /api/filters/listings/
 */
export const LISTING_FILTERS = [
  {
    key: "search",
    type: FILTER_TYPES.SEARCH,
    label: "جستجو",
    placeholder: "عنوان، شماره، منطقه...",
    icon: "Search",
  },
  {
    key: "status",
    type: FILTER_TYPES.MULTI_SELECT,
    label: "وضعیت",
    optionsKey: "listingStatus",
    icon: "Star",
  },
  {
    key: "source",
    type: FILTER_TYPES.SELECT,
    label: "منبع",
    optionsKey: "source",
    clearable: true,
    icon: "Filter",
  },
  {
    key: "district",
    type: FILTER_TYPES.SELECT,
    label: "منطقه",
    optionsKey: "district",
    clearable: true,
    icon: "MapPin",
  },
  {
    key: "rooms",
    type: FILTER_TYPES.SELECT,
    label: "اتاق",
    optionsKey: "rooms",
    clearable: true,
    icon: "Home",
  },
  {
    key: "price",
    type: FILTER_TYPES.RANGE,
    label: "محدوده قیمت",
    min: 1000000,
    max: 10000000000,
    step: 10000000,
    unit: "تومان",
    icon: "DollarSign",
  },
  {
    key: "area",
    type: FILTER_TYPES.RANGE,
    label: "محدوده متراژ",
    min: 20,
    max: 500,
    step: 10,
    unit: "متر",
    icon: "Ruler",
  },
  {
    key: "score",
    type: FILTER_TYPES.RANGE,
    label: "امتیاز",
    min: 0,
    max: 100,
    step: 5,
    unit: "امتیاز",
    icon: "Star",
  },
  {
    key: "has_picture",
    type: FILTER_TYPES.TOGGLE,
    label: "فقط عکس‌دار",
    icon: "Image",
  },
];

export const USER_FILTERS = [
  {
    key: "search",
    type: FILTER_TYPES.SEARCH,
    label: "جستجو",
    placeholder: "نام، شماره، کد ملی...",
    icon: "Search",
  },
  {
    key: "role",
    type: FILTER_TYPES.MULTI_SELECT,
    label: "نقش",
    optionsKey: "userRole",
    icon: "Shield",
  },
  {
    key: "is_active",
    type: FILTER_TYPES.SELECT,
    label: "وضعیت کاربر",
    optionsKey: "userStatus",
    clearable: true,
    icon: "Circle",
  },
  {
    key: "service_districts",
    type: FILTER_TYPES.MULTI_SELECT,
    label: "مناطق خدمت",
    optionsKey: "district",
    icon: "MapPin",
  },
];