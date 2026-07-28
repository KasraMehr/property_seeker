// User roles definition
export const MOCK_ROLES = {
  ADMIN: {
    id: 1,
    name: 'ADMIN',
    description: 'مدیر کل سیستم',
  },
  OPERATOR: {
    id: 2,
    name: 'OPERATOR',
    description: 'اپراتور / کارمند سیستم',
  },
};

// Mock system users 
export const MOCK_USERS = [
  {
    id: 1,
    phone: "09102301418",
    full_name: "علی محمدی",
    national_id: "0012345678",
    role: MOCK_ROLES.ADMIN, 
    is_active: true,
    is_staff: true,
    is_superuser: true, // Admin
    last_login: "2026-07-28T10:00:00Z",
    created_at: "2026-01-10T08:30:00Z",
    updated_at: "2026-01-10T08:30:00Z",
  },
  {
    id: 2,
    phone: "09362019241",
    full_name: "رضا احمدی",
    national_id: "0087654321",
    role: MOCK_ROLES.OPERATOR, 
    is_active: true,
    is_staff: true,
    is_superuser: false, // Operator
    last_login: "2026-07-28T11:00:00Z",
    created_at: "2026-02-15T10:15:00Z",
    updated_at: "2026-02-15T10:15:00Z",
  },
];