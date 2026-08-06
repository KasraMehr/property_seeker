import { MOCK_AGENCIES } from "./mockAgencies";
import { MOCK_USERS } from "./mockUsers";
import { MOCK_TAGS } from "./mockTags";

// customers mock - referenced by call_logs and reminders
// Customer model: id, agency(FK), full_name, phone, tags(M2M), email, customer_type, status, assigned_agent(FK User), source, notes, is_deleted, created_at, updated_at

export const MOCK_CUSTOMERS = [
  {
    id: 1, agency: MOCK_AGENCIES[0], full_name: "رضا محمدی", phone: "09151111111",
    tags: [MOCK_TAGS[0], MOCK_TAGS[2]], email: "reza@example.com",
    customer_type: "buyer", status: "interested", assigned_agent: MOCK_USERS[1],
    source: "divar", notes: "خریدار نقدی - دنبال ۱۲۰ متری گلشهر", is_deleted: false,
    created_at: "2026-07-20T09:00:00Z", updated_at: "2026-07-28T10:00:00Z",
  },
  {
    id: 2, agency: MOCK_AGENCIES[0], full_name: "سارا کریمی", phone: "09152222222",
    tags: [MOCK_TAGS[1], MOCK_TAGS[6]], email: null,
    customer_type: "tenant", status: "contacted", assigned_agent: MOCK_USERS[2],
    source: "sheypoor", notes: "دانشجو - بودجه ۵ میلیون اجاره", is_deleted: false,
    created_at: "2026-07-22T10:00:00Z", updated_at: "2026-07-27T11:00:00Z",
  },
  {
    id: 3, agency: MOCK_AGENCIES[0], full_name: "حسن احمدی", phone: "09153333333",
    tags: [MOCK_TAGS[4]], email: "hasan@example.com",
    customer_type: "investor", status: "negotiation", assigned_agent: MOCK_USERS[1],
    source: "referral", notes: "سرمایه‌گذار - دنبال زمین", is_deleted: false,
    created_at: "2026-07-15T08:00:00Z", updated_at: "2026-07-28T14:00:00Z",
  },
  {
    id: 4, agency: MOCK_AGENCIES[0], full_name: "مریم رضایی", phone: "09154444444",
    tags: [MOCK_TAGS[5], MOCK_TAGS[7]], email: null,
    customer_type: "buyer", status: "new", assigned_agent: MOCK_USERS[3],
    source: "divar", notes: "خانواده ۴ نفره - تخفیف می‌خواهد", is_deleted: false,
    created_at: "2026-07-25T09:00:00Z", updated_at: "2026-07-25T09:00:00Z",
  },
  {
    id: 5, agency: MOCK_AGENCIES[0], full_name: "علی نوری", phone: "09155555555",
    tags: [MOCK_TAGS[3]], email: "ali@example.com",
    customer_type: "landlord", status: "closed", assigned_agent: MOCK_USERS[2],
    source: "manual", notes: "موجر - آپارتمان ۹۰ متری مهرشهر", is_deleted: false,
    created_at: "2026-06-10T10:00:00Z", updated_at: "2026-07-10T09:00:00Z",
  },
  {
    id: 6, agency: MOCK_AGENCIES[0], full_name: "فاطمه صالحی", phone: "09156666666",
    tags: [MOCK_TAGS[2]], email: null,
    customer_type: "seller", status: "interested", assigned_agent: MOCK_USERS[1],
    source: "divar", notes: "فروشنده فوری - ویلای عظیمیه", is_deleted: false,
    created_at: "2026-07-26T11:00:00Z", updated_at: "2026-07-28T11:30:00Z",
  },
  {
    id: 7, agency: MOCK_AGENCIES[0], full_name: "محمد کاظمی", phone: "09157777777",
    tags: [MOCK_TAGS[0]], email: "mohammad@example.com",
    customer_type: "buyer", status: "contacted", assigned_agent: MOCK_USERS[3],
    source: "sheypoor", notes: "خریدار نقدی - دنبال ۱۵۰ متری", is_deleted: false,
    created_at: "2026-07-24T09:00:00Z", updated_at: "2026-07-27T16:00:00Z",
  },
  {
    id: 8, agency: MOCK_AGENCIES[0], full_name: "لیلا حسینی", phone: "09158888888",
    tags: [MOCK_TAGS[1], MOCK_TAGS[6]], email: null,
    customer_type: "tenant", status: "lost", assigned_agent: MOCK_USERS[2],
    source: "divar", notes: "دانشجو - بودجه کم - منصرف شد", is_deleted: false,
    created_at: "2026-07-18T10:00:00Z", updated_at: "2026-07-26T09:00:00Z",
  },
];