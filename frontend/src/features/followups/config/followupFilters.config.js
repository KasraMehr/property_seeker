import {
  FOLLOWUP_STATUS_CONFIG,
  FOLLOWUP_TYPE_CONFIG,
} from "@/constants/followupStatus.config";

/**
 * Reminder (Follow-up) Filters Config
 * Backend: crm.Reminder
 * 
 * Quick: search, type, status, user, due_date
 * Advanced: customer, property, overdue, agency, dates
 */

export const FOLLOWUP_QUICK_FILTERS = [
  {
    key: "search",
    label: "جستجو",
    type: "search",
    placeholder: "عنوان، توضیحات...",
    fields: ["title", "description"],
    placement: "bar",
  },
  {
    key: "type",
    label: "نوع وظیفه",
    type: "multi_select",
    placement: "bar",
    options: Object.entries(FOLLOWUP_TYPE_CONFIG).map(([value, cfg]) => ({
      value,
      label: cfg.label,
    })),
  },
  {
    key: "status",
    label: "وضعیت",
    type: "multi_select",
    placement: "bar",
    options: Object.entries(FOLLOWUP_STATUS_CONFIG).map(([value, cfg]) => ({
      value,
      label: cfg.label,
    })),
  },
  {
    key: "user",
    label: "مسئول",
    type: "search_select",
    placement: "bar",
    async: true,
    endpoint: "/api/accounts/users/",
    search_fields: ["full_name", "phone"],
    optionLabel: "full_name",
    optionValue: "id",
  },
  {
    key: "due_at",
    label: "موعد انجام",
    type: "date_range",
    placement: "bar",
    from_key: "due_from",
    to_key: "due_to",
  },
];

export const FOLLOWUP_ADVANCED_FILTERS = [
  {
    key: "customer",
    label: "مشتری",
    type: "search_select",
    placement: "drawer",
    async: true,
    endpoint: "/api/crm/customers/",
    search_fields: ["full_name", "phone", "national_id"],
    optionLabel: "full_name",
    optionValue: "id",
  },
  {
    key: "property",
    label: "ملک",
    type: "search_select",
    placement: "drawer",
    async: true,
    endpoint: "/api/properties/properties/",
    search_fields: ["title", "property_code"],
    optionLabel: "title",
    optionValue: "id",
  },
  {
    key: "overdue",
    label: "تنها موعد گذشته",
    type: "toggle",
    placement: "drawer",
    filter: (row) => row.status === "pending" && new Date(row.due_at) < new Date(),
  },
  {
    key: "due_today",
    label: "موعد امروز",
    type: "toggle",
    placement: "drawer",
    filter: (row) => {
      if (row.status !== "pending") return false;
      const due = new Date(row.due_at).toDateString();
      const today = new Date().toDateString();
      return due === today;
    },
  },
  {
    key: "due_this_week",
    label: "موعد این هفته",
    type: "toggle",
    placement: "drawer",
    filter: (row) => {
      if (row.status !== "pending") return false;
      const due = new Date(row.due_at);
      const today = new Date();
      const weekLater = new Date();
      weekLater.setDate(today.getDate() + 7);
      return due >= today && due <= weekLater;
    },
  },
  {
    key: "completed_today",
    label: "تکمیل‌شده امروز",
    type: "toggle",
    placement: "drawer",
    filter: (row) => {
      if (row.status !== "done" || !row.completed_at) return false;
      const completed = new Date(row.completed_at).toDateString();
      const today = new Date().toDateString();
      return completed === today;
    },
  },
  {
    key: "has_property",
    label: "دارای ملک مرتبط",
    type: "toggle",
    placement: "drawer",
    filter: (row) => !!row.property,
  },
  {
    key: "has_customer",
    label: "دارای مشتری مرتبط",
    type: "toggle",
    placement: "drawer",
    filter: (row) => !!row.customer,
  },
  {
    key: "agency",
    label: "آژانس",
    type: "search_select",
    placement: "drawer",
    async: true,
    endpoint: "/api/accounts/agencies/",
    search_fields: ["name"],
    optionLabel: "name",
    optionValue: "id",
  },
  {
    key: "created_at",
    label: "تاریخ ایجاد",
    type: "date_range",
    placement: "drawer",
    from_key: "created_from",
    to_key: "created_to",
  },
  {
    key: "completed_at",
    label: "تاریخ تکمیل",
    type: "date_range",
    placement: "drawer",
    from_key: "completed_from",
    to_key: "completed_to",
  },
];

export const FOLLOWUP_ALL_FILTERS = [...FOLLOWUP_QUICK_FILTERS, ...FOLLOWUP_ADVANCED_FILTERS];