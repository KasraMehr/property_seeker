export const USER_FILTERS = [
  {
    key: "search",
    type: "search",
    label: "جستجو",
    placeholder: "نام، شماره تماس، کد ملی...",
  },
  {
    key: "role",
    type: "select",
    label: "نقش",
    optionsKey: "roles",
    options: [
      { value: "admin", label: "مدیر" },
      { value: "supervisor", label: "سرپرست" },
      { value: "operator", label: "اپراتور" },
      { value: "agent", label: "مشاور" },
      { value: "viewer", label: "ناظر" },
    ],
  },
  {
    key: "is_active",
    type: "select",
    label: "وضعیت حساب",
    optionsKey: "statuses",
    options: [
      { value: "true", label: "فعال" },
      { value: "false", label: "غیرفعال" },
    ],
  },
  {
    key: "agency",
    type: "select",
    label: "آژانس",
    optionsKey: "agencies",
    options: [
      { value: "1", label: "ملک جو (شعبه مرکزی)" },
      { value: "2", label: "ملک جو (شعبه گلشهر)" },
    ],
  },
];