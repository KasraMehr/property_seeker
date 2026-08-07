import { MOCK_USERS } from "./mockUsers";
import { MOCK_CUSTOMERS } from "./mockCustomers";
import { MOCK_PROPERTIES } from "./mockProperties";
import { MOCK_AGENCIES } from "./mockAgencies";

// Reminder: id, agency(FK), user(FK), customer(FK, nullable), property(FK, nullable),
// title, type, description, due_at, status, completed_at, created_at, updated_at

export const MOCK_REMINDERS = [
  {
    id: 1, agency: MOCK_AGENCIES[0], user: MOCK_USERS[1], customer: MOCK_CUSTOMERS[0], property: null,
    title: "پیگیری ملک گلشهر", type: "follow_up", description: "تماس با مالک برای عقد قرارداد",
    due_at: "2026-07-29T09:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T10:00:00Z", updated_at: "2026-07-28T10:00:00Z",
  },
  {
    id: 2, agency: MOCK_AGENCIES[0], user: MOCK_USERS[1], customer: MOCK_CUSTOMERS[1], property: null,
    title: "ارسال عکس ویلا", type: "other", description: "ارسال تصاویر بیشتر از طریق واتساپ",
    due_at: "2026-07-29T14:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-27T16:30:00Z", updated_at: "2026-07-27T16:30:00Z",
  },
  {
    id: 3, agency: MOCK_AGENCIES[0], user: MOCK_USERS[2], customer: MOCK_CUSTOMERS[2], property: null,
    title: "بازدید دفتر کار", type: "visit", description: "بازدید با مشتری ساعت ۱۰",
    due_at: "2026-07-29T10:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T14:00:00Z", updated_at: "2026-07-28T14:00:00Z",
  },
  {
    id: 4, agency: MOCK_AGENCIES[0], user: MOCK_USERS[1], customer: MOCK_CUSTOMERS[3], property: null,
    title: "تماس مجدد", type: "call", description: "اولین تماس بی‌پاسخ بود",
    due_at: "2026-07-28T16:00:00Z", status: "done", completed_at: "2026-07-28T16:30:00Z",
    created_at: "2026-07-27T11:00:00Z", updated_at: "2026-07-28T16:30:00Z",
  },
  {
    id: 5, agency: MOCK_AGENCIES[0], user: MOCK_USERS[2], customer: MOCK_CUSTOMERS[0], property: MOCK_PROPERTIES[0],
    title: "امضای قرارداد فروش", type: "other", description: "قرارداد فروش آپارتمان گلشهر",
    due_at: "2026-07-31T10:00:00Z", status: "pending", completed_at: null,
    created_at: "2026-07-28T15:00:00Z", updated_at: "2026-07-28T15:00:00Z",
  },
];