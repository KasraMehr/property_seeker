import { MOCK_AGENCIES } from "./mockAgencies";
import { MOCK_ROLES } from "./mockRoles";

// system users mock - agency scoped
export const MOCK_USERS = [
  {
    id: 1,
    phone: "09102301418",
    full_name: "مدیریت ملک جو",
    national_id: "0012345678",
    agency: MOCK_AGENCIES[0],
    role: [MOCK_ROLES.ADMIN],
    service_districts: [
      { id: 1, name: "منطقه ۱" },
      { id: 2, name: "منطقه ۲" },
    ],
    is_owner: true,
    is_active: true,
    is_staff: true,
    created_at: "2026-01-10T08:30:00Z",
    updated_at: "2026-01-10T08:30:00Z",
  },
  {
    id: 2,
    phone: "09362019241",
    full_name: "کارشناس ۱",
    national_id: "0087654321",
    agency: MOCK_AGENCIES[0],
    role: [MOCK_ROLES.OPERATOR],
    service_districts: [
      { id: 2, name: "منطقه ۲" },
    ],
    is_owner: false,
    is_active: true,
    is_staff: true,
    created_at: "2026-02-15T10:15:00Z",
    updated_at: "2026-02-15T10:15:00Z",
  },
  {
    id: 3,
    phone: "09191234567",
    full_name: "کارشناس ۲",
    national_id: "0077112233",
    agency: MOCK_AGENCIES[0],
    role: [MOCK_ROLES.OPERATOR],
    service_districts: [
      { id: 3, name: "منطقه ۳" },
    ],
    is_owner: false,
    is_active: true,
    is_staff: true,
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-03-01T09:00:00Z",
  },
];