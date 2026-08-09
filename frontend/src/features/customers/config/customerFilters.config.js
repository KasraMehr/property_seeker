import { CUSTOMER_TYPE_CONFIG, CUSTOMER_STATUS_CONFIG } from "./customerStatus.config";

export const CUSTOMER_QUICK_FILTERS = [
  {
    key: "search",
    label: "جستجو",
    type: "search",
    placeholder: "نام، شماره تلفن...",
    placement: "bar",
  },
  {
    key: "customer_type",
    label: "نوع مشتری",
    type: "multi_select",
    placement: "bar",
    options: Object.entries(CUSTOMER_TYPE_CONFIG).map(([value, cfg]) => ({
      value,
      label: cfg.label,
    })),
  },
  {
    key: "status",
    label: "وضعیت",
    type: "multi_select",
    placement: "bar",
    options: Object.entries(CUSTOMER_STATUS_CONFIG).map(([value, cfg]) => ({
      value,
      label: cfg.label,
    })),
  },
];

export const CUSTOMER_ADVANCED_FILTERS = [];
export const CUSTOMER_ALL_FILTERS = [...CUSTOMER_QUICK_FILTERS, ...CUSTOMER_ADVANCED_FILTERS];