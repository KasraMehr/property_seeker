export const CALL_FILTERS = [
  {
    key: "search",
    type: "search",
    label: "جستجو",
    placeholder: "یادداشت، نام مشتری، کد ملک...",
  },
  {
    key: "call_type",
    type: "select",
    label: "نوع تماس",
    optionsKey: "callTypes",
    options: [
      { value: "incoming", label: "ورودی" },
      { value: "outgoing", label: "خروجی" },
    ],
  },
  {
    key: "result",
    type: "select",
    label: "نتیجه",
    optionsKey: "results",
    options: [
      { value: "answered", label: "پاسخ داده" },
      { value: "no_answer", label: "بدون پاسخ" },
      { value: "busy", label: "مشغول" },
      { value: "voicemail", label: "صندوق صوتی" },
      { value: "callback_requested", label: "درخواست تماس مجدد" },
    ],
  },
  {
    key: "handled_by",
    type: "select",
    label: "اپراتور",
    optionsKey: "users",
    options: [
      { value: "1", label: "مدیریت ملک جو" },
      { value: "2", label: "کارشناس ۱ - علی رضایی" },
      { value: "3", label: "کارشناس ۲ - سارا محمدی" },
      { value: "4", label: "کارشناس ۳ - حسن کریمی" },
    ],
  },
  {
    key: "follow_up_done",
    type: "select",
    label: "وضعیت پیگیری",
    optionsKey: "followUpStatuses",
    options: [
      { value: "true", label: "انجام شده" },
      { value: "false", label: "در انتظار" },
    ],
  },
  {
    key: "called_at",
    type: "date_range",
    label: "تاریخ تماس",
  },
];