export const OWNER_FILTERS = [
  {
    key: "created_by",
    label: "ثبت‌کننده",
    type: "select",
    placement: "drawer",
    async: true,
    endpoint: "/api/accounts/users/",
    search_fields: ["full_name", "phone"],
    optionLabel: "full_name",
    optionValue: "id",
  },
  {
    key: "has_alternate_phone",
    label: "دارای شماره تماس جایگزین",
    type: "toggle",
    placement: "drawer",
  },
  {
    key: "has_national_id",
    label: "دارای کد ملی",
    type: "toggle",
    placement: "drawer",
  },
  {
    key: "has_notes",
    label: "دارای یادداشت",
    type: "toggle",
    placement: "drawer",
  },
  {
    key: "created_at",
    label: "تاریخ ثبت",
    type: "date_range",
    placement: "drawer",
    from_key: "created_from",
    to_key: "created_to",
  },
  {
    key: "updated_at",
    label: "آخرین بروزرسانی",
    type: "date_range",
    placement: "drawer",
    from_key: "updated_from",
    to_key: "updated_to",
  },
];

export const OWNER_ALL_FILTERS = [...OWNER_FILTERS];