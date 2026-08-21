import { API_ENDPOINTS } from "@/constants/apiEndpoints";

/**
 * Create/Edit Region Form
 */
export const REGION_FORM = {
  title: "منطقه",
  tabs: [
    {
      key: "basic",
      label: "اطلاعات پایه",
      icon: "Map",
      fields: [
        {
          key: "name",
          label: "نام منطقه",
          type: "text",
          required: true,
          placeholder: "مثلاً منطقه ۱",
          validation: { required: "نام منطقه الزامی است" },
          span: 12,
        },
        {
          key: "province",
          label: "استان",
          type: "select",
          required: true,
          placeholder: "انتخاب استان",
          asyncSource: API_ENDPOINTS.LOCATIONS.PROVINCES.LIST.url,
          span: 6,
        },
        {
          key: "city",
          label: "شهر",
          type: "select",
          required: true,
          placeholder: "انتخاب شهر",
          dependsOn: "province",
          // Backend returns all cities; cascade filter is client-side for now
          asyncSource: API_ENDPOINTS.LOCATIONS.CITIES.LIST.url,
          validation: { required: "شهر الزامی است" },
          span: 6,
        },
      ],
    },
  ],
  actions: {
    submit: { label: "ذخیره منطقه", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};