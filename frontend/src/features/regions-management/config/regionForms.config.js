
/**
 * Create/Edit Region Form
 */
export const REGION_FORM = {
  title: "منطقه / محله",
  tabs: [
    {
      key: "basic",
      label: "اطلاعات پایه",
      icon: "Map",
      fields: [
        {
          key: "name",
          label: "نام منطقه / محله",
          type: "text",
          required: true,
          placeholder: "مثلاً منطقه ۱ کرج",
          validation: { required: "نام منطقه الزامی است" },
          span: 12,
        },
        {
          key: "province",
          label: "استان",
          type: "select",
          required: true,
          placeholder: "انتخاب استان",
          asyncSource: "/api/province/list",
          validation: { required: "استان الزامی است" },
          span: 6,
        },
        {
          key: "city",
          label: "شهر",
          type: "select",
          required: true,
          placeholder: "انتخاب شهر",
          dependsOn: "province",
          asyncSource: "/api/city/list/?province={province}",
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