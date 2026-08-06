import { MOCK_USERS } from "./mockUsers";
import { MOCK_CUSTOMERS } from "./mockCustomers";
import { MOCK_PROPERTIES } from "./mockProperties";
import { MOCK_AGENCIES } from "./mockAgencies";

// reminders / follow-ups mock - operator tasks
// Reminder model: id, agency(FK), user(FK), customer(FK, nullable), property(FK, nullable), title, type, description, due_at, status, completed_at, created_at, updated_at

export const MOCK_REMINDERS = [
  {
    id: 1, agency: MOCK_AGENCIES[0], user: MOCK_USERS[1], customer: MOCK_CUSTOMERS[0], property: null,
    title: "پیگیری ملک نیاوران", type: "follow_up", description: "تماس با مالک برای عقد قرارداد",
    due_at: "2026-07-29T09:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T10:00:00Z", updated_at: "2026-07-28T10:00:00Z",
  },
  {
    id: 2, agency: MOCK_AGENCIES[0], user: MOCK_USERS[1], customer: MOCK_CUSTOMERS[1], property: null,
    title: "ارسال عکس ویلای لواسان", type: "other", description: "ارسال تصاویر بیشتر از طریق واتساپ",
    due_at: "2026-07-29T14:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-27T16:30:00Z", updated_at: "2026-07-27T16:30:00Z",
  },
  {
    id: 3, agency: MOCK_AGENCIES[0], user: MOCK_USERS[2], customer: MOCK_CUSTOMERS[2], property: null,
    title: "بازدید دفتر کار الهیه", type: "visit", description: "بازدید با مشتری ساعت ۱۰",
    due_at: "2026-07-29T10:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T14:00:00Z", updated_at: "2026-07-28T14:00:00Z",
  },
  {
    id: 4, agency: MOCK_AGENCIES[0], user: MOCK_USERS[1], customer: MOCK_CUSTOMERS[3], property: null,
    title: "تماس مجدد آپارتمان زعفرانیه", type: "call", description: "اولین تماس بی‌پاسخ بود",
    due_at: "2026-07-28T16:00:00Z", status: "done", completed_at: "2026-07-28T16:30:00Z",
    created_at: "2026-07-27T11:00:00Z", updated_at: "2026-07-28T16:30:00Z",
  },
  {
    id: 5, agency: MOCK_AGENCIES[0], user: MOCK_USERS[2], customer: MOCK_CUSTOMERS[4], property: null,
    title: "ارسال قرارداد اجاره", type: "other", description: "ارسال پیش‌نویس قرارداد به مالک",
    due_at: "2026-07-30T09:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T11:00:00Z", updated_at: "2026-07-28T11:00:00Z",
  },
  {
    id: 6, agency: MOCK_AGENCIES[0], user: MOCK_USERS[3], customer: MOCK_CUSTOMERS[5], property: null,
    title: "پیگیری وام مسکن", type: "follow_up", description: "استعلام وام برای خریدار",
    due_at: "2026-07-29T11:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-27T09:00:00Z", updated_at: "2026-07-28T10:00:00Z",
  },
  {
    id: 7, agency: MOCK_AGENCIES[0], user: MOCK_USERS[1], customer: MOCK_CUSTOMERS[6], property: null,
    title: "بازدید ویلای عظیمیه", type: "visit", description: "بازدید با مشتری ساعت ۹ صبح",
    due_at: "2026-07-30T09:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T16:00:00Z", updated_at: "2026-07-28T16:00:00Z",
  },
  {
    id: 8, agency: MOCK_AGENCIES[0], user: MOCK_USERS[3], customer: MOCK_CUSTOMERS[7], property: null,
    title: "تماس با بانک", type: "call", description: "استعلام چک صیادی مالک",
    due_at: "2026-07-28T14:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-27T10:00:00Z", updated_at: "2026-07-28T08:00:00Z",
  },
  {
    id: 9, agency: MOCK_AGENCIES[0], user: MOCK_USERS[2], customer: MOCK_CUSTOMERS[0], property: MOCK_PROPERTIES[0],
    title: "امضای قرارداد فروش", type: "other", description: "قرارداد فروش آپارتمان گلشهر",
    due_at: "2026-07-31T10:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T15:00:00Z", updated_at: "2026-07-28T15:00:00Z",
  },
  {
    id: 10, agency: MOCK_AGENCIES[0], user: MOCK_USERS[1], customer: null, property: MOCK_PROPERTIES[1],
    title: "ارسال فایل به مشاور", type: "other", description: "ارسال مدارک به مشاور حقوقی",
    due_at: "2026-07-29T16:00:00Z", status: "canceled", completed_at: null,
    created_at: "2026-07-26T11:00:00Z", updated_at: "2026-07-27T09:00:00Z",
  },
  {
    id: 11, agency: MOCK_AGENCIES[0], user: MOCK_USERS[3], customer: MOCK_CUSTOMERS[2], property: null,
    title: "پیگیری سند", type: "follow_up", description: "پیگیری وضعیت سند تک برگ",
    due_at: "2026-08-01T09:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T12:00:00Z", updated_at: "2026-07-28T12:00:00Z",
  },
  {
    id: 12, agency: MOCK_AGENCIES[0], user: MOCK_USERS[2], customer: MOCK_CUSTOMERS[4], property: MOCK_PROPERTIES[3],
    title: "بازدید مغازه", type: "visit", description: "بازدید مغازه بلوار امام با مستأجر",
    due_at: "2026-07-30T11:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T13:00:00Z", updated_at: "2026-07-28T13:00:00Z",
  },
  {
    id: 13, agency: MOCK_AGENCIES[0], user: MOCK_USERS[1], customer: MOCK_CUSTOMERS[5], property: null,
    title: "تماس با مالک جدید", type: "call", description: "معرفی خریدار به مالک",
    due_at: "2026-07-29T10:00:00Z", status: "done", completed_at: "2026-07-29T09:30:00Z",
    created_at: "2026-07-28T08:00:00Z", updated_at: "2026-07-29T09:30:00Z",
  },
  {
    id: 14, agency: MOCK_AGENCIES[0], user: MOCK_USERS[3], customer: MOCK_CUSTOMERS[6], property: null,
    title: "استعلام شهرداری", type: "follow_up", description: "استعلام پایان کار ساختمان",
    due_at: "2026-07-29T13:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-27T14:00:00Z", updated_at: "2026-07-28T11:00:00Z",
  },
  {
    id: 15, agency: MOCK_AGENCIES[0], user: MOCK_USERS[2], customer: MOCK_CUSTOMERS[7], property: null,
    title: "پیگیری وام دانشجویی", type: "follow_up", description: "استعلام وام برای مستأجر",
    due_at: "2026-07-28T17:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-27T16:00:00Z", updated_at: "2026-07-28T08:00:00Z",
  },
];