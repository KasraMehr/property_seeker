import { MOCK_AGENCIES } from "./mockAgencies";

// property owners mock - scoped to agency
export const MOCK_OWNERS = [
  {
    id: 1,
    full_name: "علی احمدی",
    phone: "09121111111",
    alternate_phone: "02144000000",
    national_id: "0054321890",
    notes: "مالک قدیمی - همکاری خوب",
    agency: MOCK_AGENCIES[0],
    created_by: 1,
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-03-01T09:00:00Z",
  },
  {
    id: 2,
    full_name: "مریم رضایی",
    phone: "09122222222",
    alternate_phone: null,
    national_id: "0067891234",
    notes: "فقط تماس صبح",
    agency: MOCK_AGENCIES[0],
    created_by: 1,
    created_at: "2026-03-05T14:30:00Z",
    updated_at: "2026-03-05T14:30:00Z",
  },
  {
    id: 3,
    full_name: "حسن محمدی",
    phone: "09123333333",
    alternate_phone: "02155000000",
    national_id: "0099887766",
    notes: "",
    agency: MOCK_AGENCIES[0],
    created_by: 2,
    created_at: "2026-04-10T11:00:00Z",
    updated_at: "2026-04-10T11:00:00Z",
  },
];