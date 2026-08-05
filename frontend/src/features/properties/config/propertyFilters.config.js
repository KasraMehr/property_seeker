/**
 * فیلترها بر اساس PropertySelector و فیلدهای PropertyListSerializer
 * نکته: ویو PropertyListView هنوز query param نمی‌خواند.
 */
export const PROPERTY_FILTERS = [
  {
    key: "search",
    type: "search",
    label: "جستجو",
    placeholder: "کد ملک یا عنوان...",
    backendField: "title,property_code",
    backendSupported: false,
  },
  {
    key: "status",
    type: "select",
    label: "وضعیت",
    backendField: "status",
    backendSupported: false,
    options: [
      { value: "available", label: "فعال" },
      { value: "reserved", label: "رزرو" },
      { value: "sold", label: "فروخته شده" },
      { value: "rented", label: "اجاره داده شده" },
      { value: "archived", label: "بایگانی" },
    ],
  },
  {
    key: "deal_type",
    type: "select",
    label: "نوع معامله",
    backendField: "deal_type",
    backendSupported: false,
    options: [
      { value: "sale", label: "فروش" },
      { value: "rent", label: "اجاره" },
      { value: "mortgage", label: "رهن کامل" },
      { value: "exchange", label: "معاوضه" },
    ],
  },
  {
    key: "owner",
    type: "select",
    label: "مالک",
    backendField: "owner_id",
    backendSupported: false,
    async: true,
    // TODO:endpoint: "/api/owner/list/",
    endpoint:"",
  },
  {
    key: "agent",
    type: "select",
    label: "کارشناس",
    backendField: "agent_id",
    backendSupported: false,
    async: true,
    // TODO:endpoint: "/api/accounts/users/",
    endpoint:"",
  },
];