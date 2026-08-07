/**
 * Region (District) Filters Config
 * Backend: locations.District
 * 
 * Quick: search, province, city
 * Advanced: has_agents, has_properties, neighborhoods
 */

export const REGION_QUICK_FILTERS = [
  {
    key: "search",
    label: "جستجو",
    type: "search",
    placeholder: "نام منطقه، شهر، استان...",
    fields: ["name", "city.name", "city.province.name"],
    placement: "bar",
  },
  {
    key: "province",
    label: "استان",
    type: "select",
    placement: "bar",
    async: true,
    endpoint: "/api/locations/provinces/",
    optionLabel: "name",
    optionValue: "id",
  },
  {
    key: "city",
    label: "شهر",
    type: "select",
    placement: "bar",
    async: true,
    endpoint: "/api/locations/cities/",
    depends_on: "province",
    optionLabel: "name",
    optionValue: "id",
  },
];

export const REGION_ADVANCED_FILTERS = [
  {
    key: "has_agents",
    label: "دارای مشاور",
    type: "toggle",
    placement: "drawer",
    filter: (row) => row.agents_count > 0,
  },
  {
    key: "has_properties",
    label: "دارای فایل",
    type: "toggle",
    placement: "drawer",
    filter: (row) => row.properties_count > 0,
  },
  {
    key: "has_neighborhoods",
    label: "دارای محله",
    type: "toggle",
    placement: "drawer",
    filter: (row) => (row.neighborhoods || []).length > 0,
  },
  {
    key: "agents_count",
    label: "تعداد مشاوران",
    type: "range",
    placement: "drawer",
    min_key: "agents_min",
    max_key: "agents_max",
    step: 1,
    unit: "نفر",
  },
  {
    key: "properties_count",
    label: "تعداد فایل‌ها",
    type: "range",
    placement: "drawer",
    min_key: "properties_min",
    max_key: "properties_max",
    step: 1,
    unit: "فایل",
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

export const REGION_ALL_FILTERS = [...REGION_QUICK_FILTERS, ...REGION_ADVANCED_FILTERS];