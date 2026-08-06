export const FOLLOWUP_FILTERS = [
  {
    key: "search",
    type: "search",
    label: "جستجو",
    placeholder: "عنوان، توضیحات، نام مشتری...",
  },
  {
    key: "status",
    type: "select",
    label: "وضعیت",
    optionsKey: "statuses",
    options: [
      { value: "pending", label: "در انتظار" },
      { value: "completed", label: "انجام شده" },
      { value: "cancelled", label: "لغو شده" },
    ],
  },
  {
    key: "type",
    type: "select",
    label: "نوع",
    optionsKey: "types",
    options: [
      { value: "follow_up", label: "پیگیری" },
      { value: "visit", label: "بازدید" },
      { value: "meeting", label: "جلسه" },
      { value: "contract", label: "قرارداد" },
    ],
  },
  {
    key: "user",
    type: "select",
    label: "مسئول",
    optionsKey: "users",
    options: [
      { value: "1", label: "مدیریت ملک جو" },
      { value: "2", label: "کارشناس ۱ - علی رضایی" },
      { value: "3", label: "کارشناس ۲ - سارا محمدی" },
      { value: "4", label: "کارشناس ۳ - حسن کریمی" },
    ],
  },
  {
    key: "due_at",
    type: "date_range",
    label: "تاریخ سررسید",
  },
];