import { MOCK_USERS } from "./mockUsers";
import { MOCK_CUSTOMERS } from "./mockCustomers";
import { MOCK_LISTINGS } from "./mockListings";
import { MOCK_PROPERTIES } from "./mockProperties";
import { MOCK_AGENCIES } from "./mockAgencies";

// CallLog: id, agency(FK), customer(FK), property(FK, nullable), listing(FK, nullable),
// handled_by(FK), call_type, result, note, call_duration, next_follow_up_at,
// follow_up_done, record_file, called_at, is_deleted, created_at

export const MOCK_CALL_LOGS = [
  {
    id: 1, agency: MOCK_AGENCIES[0], customer: MOCK_CUSTOMERS[0], property: null, listing: MOCK_LISTINGS[0],
    handled_by: MOCK_USERS[1], call_type: "outgoing", result: "interested",
    note: "مالک فردا برای عقد قرارداد می‌آید",
    call_duration: 180, next_follow_up_at: "2026-07-29T09:00:00Z", follow_up_done: false,
    record_file: null, called_at: "2026-07-28T10:00:00Z", is_deleted: false, created_at: "2026-07-28T10:00:00Z",
  },
  {
    id: 2, agency: MOCK_AGENCIES[0], customer: MOCK_CUSTOMERS[1], property: null, listing: MOCK_LISTINGS[0],
    handled_by: MOCK_USERS[1], call_type: "outgoing", result: "no_answer",
    note: "دوباره تماس گرفته شود",
    call_duration: 0, next_follow_up_at: "2026-07-28T16:00:00Z", follow_up_done: false,
    record_file: null, called_at: "2026-07-27T11:00:00Z", is_deleted: false, created_at: "2026-07-27T11:00:00Z",
  },
  {
    id: 3, agency: MOCK_AGENCIES[0], customer: MOCK_CUSTOMERS[2], property: null, listing: MOCK_LISTINGS[1],
    handled_by: MOCK_USERS[1], call_type: "incoming", result: "follow_up",
    note: "درخواست ارسال عکس بیشتر",
    call_duration: 120, next_follow_up_at: "2026-07-29T14:00:00Z", follow_up_done: false,
    record_file: null, called_at: "2026-07-27T16:30:00Z", is_deleted: false, created_at: "2026-07-27T16:30:00Z",
  },
  {
    id: 4, agency: MOCK_AGENCIES[0], customer: MOCK_CUSTOMERS[3], property: null, listing: MOCK_LISTINGS[2],
    handled_by: MOCK_USERS[2], call_type: "outgoing", result: "visit_booked",
    note: "بازدید فردا ساعت ۱۰ صبح",
    call_duration: 240, next_follow_up_at: "2026-07-29T10:00:00Z", follow_up_done: false,
    record_file: null, called_at: "2026-07-28T14:00:00Z", is_deleted: false, created_at: "2026-07-28T14:00:00Z",
  },
  {
    id: 5, agency: MOCK_AGENCIES[0], customer: MOCK_CUSTOMERS[0], property: MOCK_PROPERTIES[0], listing: null,
    handled_by: MOCK_USERS[1], call_type: "outgoing", result: "answered",
    note: "تبدیل به پرونده رسمی - کد PR-2026-000001",
    call_duration: 420, next_follow_up_at: null, follow_up_done: true,
    record_file: null, called_at: "2026-07-28T10:30:00Z", is_deleted: false, created_at: "2026-07-28T10:30:00Z",
  },
];