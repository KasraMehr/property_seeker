import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const REGION_QUICK_FILTERS = [
  {
    key: "search",
    label: "جستجو",
    type: "search",
    placeholder: "نام منطقه، شهر...",
    fields: ["name", "city_name"],
    placement: "bar",
  },
  {
    key: "province",
    label: "استان",
    type: "select",
    placement: "bar",
    async: true,
    endpoint: API_ENDPOINTS.LOCATIONS.PROVINCES.LIST.url,
    optionLabel: "name",
    optionValue: "id",
  },
  {
    key: "city",
    label: "شهر",
    type: "select",
    placement: "bar",
    async: true,
    endpoint: API_ENDPOINTS.LOCATIONS.CITIES.LIST.url,
    depends_on: "province",
    optionLabel: "name",
    optionValue: "id",
  },
];

export const REGION_ADVANCED_FILTERS = [];

export const REGION_ALL_FILTERS = [...REGION_QUICK_FILTERS, ...REGION_ADVANCED_FILTERS];