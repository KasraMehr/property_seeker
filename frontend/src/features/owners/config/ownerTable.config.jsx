
export const OWNER_TABLE_COLUMNS = [
  {
    key: "full_name",
    header: "نام و نام خانوادگی",
    width: "w-48",
    searchable: true,
    cell: ({ full_name }) => (
      <span className="font-medium truncate max-w-50" title={full_name}>
        {full_name || "—"}
      </span>
    ),
  },
  {
    key: "phone",
    header: "شماره تماس",
    width: "w-32",
    searchable: true,
    cell: ({ phone }) => (
      <span className="text-sm">
        {phone || "—"}
      </span>
    ),
  },
  {
    key: "properties_count",
    header: "تعداد املاک",
    width: "w-28",
    cell: ({ properties_count }) => (
      <span className="text-sm font-medium">
        {properties_count ?? 0}
      </span>
    ),
  },
  {
    key: "created_by",
    header: "ثبت‌کننده",
    width: "w-32",
    cell: ({ created_by }) => (
      <span className="text-sm">
        {created_by || "—"}
      </span>
    ),
  },
  // {
  //   key: "actions",
  //   header: "",
  //   width: "w-20",
  //   actions: true,
  // },
];