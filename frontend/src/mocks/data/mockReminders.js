import { MOCK_USERS } from "./mockUsers";

// reminders / follow-ups mock - operator tasks
export const MOCK_REMINDERS = [
  {
    id: 1, user: MOCK_USERS[1], customer: null, property: null,
    title: "پیگیری ملک نیاوران", description: "تماس با مالک برای عقد قرارداد",
    due_at: "2026-07-29T09:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T10:00:00Z", updated_at: "2026-07-28T10:00:00Z",
  },
  {
    id: 2, user: MOCK_USERS[1], customer: null, property: null,
    title: "ارسال عکس ویلای لواسان", description: "ارسال تصاویر بیشتر از طریق واتساپ",
    due_at: "2026-07-29T14:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-27T16:30:00Z", updated_at: "2026-07-27T16:30:00Z",
  },
  {
    id: 3, user: MOCK_USERS[2], customer: null, property: null,
    title: "بازدید دفتر کار الهیه", description: "بازدید با مشتری ساعت ۱۰",
    due_at: "2026-07-29T10:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T14:00:00Z", updated_at: "2026-07-28T14:00:00Z",
  },
  {
    id: 4, user: MOCK_USERS[1], customer: null, property: null,
    title: "تماس مجدد آپارتمان زعفرانیه", description: "اولین تماس بی‌پاسخ بود",
    due_at: "2026-07-28T16:00:00Z", status: "done", completed_at: "2026-07-28T16:30:00Z",
    created_at: "2026-07-27T11:00:00Z", updated_at: "2026-07-28T16:30:00Z",
  },
  {
    id: 5, user: MOCK_USERS[2], customer: null, property: null,
    title: "ارسال قرارداد اجاره", description: "ارسال پیش‌نویس قرارداد به مالک",
    due_at: "2026-07-30T09:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T11:00:00Z", updated_at: "2026-07-28T11:00:00Z",
  },
  {
    id: 6, user: MOCK_USERS[3], customer: null, property: null,
    title: "پیگیری وام مسکن", description: "استعلام وام برای خریدار",
    due_at: "2026-07-29T11:00:00Z", status: "in_progress", completed_at: null,
    created_at: "2026-07-27T09:00:00Z", updated_at: "2026-07-28T10:00:00Z",
  },
  {
    id: 7, user: MOCK_USERS[1], customer: null, property: null,
    title: "بازدید ویلای عظیمیه", description: "بازدید با مشتری ساعت ۹ صبح",
    due_at: "2026-07-30T09:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T16:00:00Z", updated_at: "2026-07-28T16:00:00Z",
  },
  {
    id: 8, user: MOCK_USERS[3], customer: null, property: null,
    title: "تماس با بانک", description: "استعلام چک صیادی مالک",
    due_at: "2026-07-28T14:00:00Z", status: "overdue", completed_at: null,
    created_at: "2026-07-27T10:00:00Z", updated_at: "2026-07-28T08:00:00Z",
  },
  {
    id: 9, user: MOCK_USERS[2], customer: null, property: null,
    title: "امضای قرارداد فروش", description: "قرارداد فروش آپارتمان گلشهر",
    due_at: "2026-07-31T10:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T15:00:00Z", updated_at: "2026-07-28T15:00:00Z",
  },
  {
    id: 10, user: MOCK_USERS[1], customer: null, property: null,
    title: "ارسال فایل به مشاور", description: "ارسال مدارک به مشاور حقوقی",
    due_at: "2026-07-29T16:00:00Z", status: "cancelled", completed_at: null,
    created_at: "2026-07-26T11:00:00Z", updated_at: "2026-07-27T09:00:00Z",
  },
  {
    id: 11, user: MOCK_USERS[3], customer: null, property: null,
    title: "پیگیری سند", description: "پیگیری وضعیت سند تک برگ",
    due_at: "2026-08-01T09:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T12:00:00Z", updated_at: "2026-07-28T12:00:00Z",
  },
  {
    id: 12, user: MOCK_USERS[2], customer: null, property: null,
    title: "بازدید مغازه", description: "بازدید مغازه بلوار امام با مستأجر",
    due_at: "2026-07-30T11:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T13:00:00Z", updated_at: "2026-07-28T13:00:00Z",
  },
  {
    id: 13, user: MOCK_USERS[1], customer: null, property: null,
    title: "تماس با مالک جدید", description: "معرفی خریدار به مالک",
    due_at: "2026-07-29T10:00:00Z", status: "done", completed_at: "2026-07-29T09:30:00Z",
    created_at: "2026-07-28T08:00:00Z", updated_at: "2026-07-29T09:30:00Z",
  },
  {
    id: 14, user: MOCK_USERS[3], customer: null, property: null,
    title: "استعلام شهرداری", description: "استعلام پایان کار ساختمان",
    due_at: "2026-07-29T13:00:00Z", status: "in_progress", completed_at: null,
    created_at: "2026-07-27T14:00:00Z", updated_at: "2026-07-28T11:00:00Z",
  },
  {
    id: 15, user: MOCK_USERS[2], customer: null, property: null,
    title: "پیگیری وام دانشجویی", description: "استعلام وام برای مستأجر",
    due_at: "2026-07-28T17:00:00Z", status: "overdue", completed_at: null,
    created_at: "2026-07-27T16:00:00Z", updated_at: "2026-07-28T08:00:00Z",
  },
];