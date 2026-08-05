/**
 * فیلترها بر اساس فیلدهای مدل Listing
 * نکته: Listing هنوز view/serializer ندارد → همه backendSupported: false
 * score / assigned_to / district حذف شدند چون در مدل نیستند.
 */
export const LISTING_FILTERS = [
  {
    key: "search",
    type: "search",
    label: "جستجو",
    placeholder: "عنوان، شناسه خارجی یا کد ملک...",
    backendField: "title,external_id",
    backendSupported: false,
  },
  {
    key: "status",
    type: "select",
    label: "وضعیت",
    backendField: "status",
    backendSupported: false,
    options: [
      { value: "draft", label: "پیش نویس" },
      { value: "active", label: "فعال" },
      { value: "paused", label: "متوقف" },
      { value: "sold", label: "فروخته شده" },
      { value: "rented", label: "اجاره داده شده" },
      { value: "expired", label: "منقضی شده" },
      { value: "archived", label: "آرشیو" },
    ],
  },
  {
    key: "source",
    type: "select",
    label: "منبع",
    backendField: "source_id",
    backendSupported: false,
    async: true,
    endpoint: "/api/sources/", // پیشنهادی: API مدل Source
  },
  {
    key: "listed_area",
    type: "range",
    label: "متراژ",
    min: 0,
    max: 1000,
    backendSupported: false,
  },
  {
    key: "created_by",
    type: "select",
    label: "ایجاد کننده",
    backendField: "created_by_id",
    backendSupported: false,
    async: true,
    //TODO: endpoint: "/api/accounts/users/",
    endpoint:"",
  },
];