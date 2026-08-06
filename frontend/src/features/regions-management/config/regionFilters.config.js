export const REGION_FILTERS = [
  {
    key: "search",
    type: "search",
    label: "جستجو",
    placeholder: "نام منطقه، محله...",
  },
  {
    key: "city",
    type: "select",
    label: "شهر",
    optionsKey: "cities",
    options: [
      { value: "1", label: "کرج" },
      { value: "2", label: "ماهدشت" },
      { value: "3", label: "تهران" },
    ],
  },
  {
    key: "has_listings",
    type: "select",
    label: "وضعیت آگهی",
    optionsKey: "listingStatuses",
    options: [
      { value: "true", label: "دارای آگهی" },
      { value: "false", label: "بدون آگهی" },
    ],
  },
];