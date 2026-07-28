import { http, HttpResponse } from 'msw';
import { MOCK_USERS } from '../data/mockUsers';
import { MOCK_NEIGHBORHOODS, MOCK_DISTRICTS, MOCK_CITIES, MOCK_PROVINCES } from '../data/mockLocations';
import { MOCK_LEADS } from '../data/mockLeads';
import { MOCK_PROPERTIES } from '../data/mockProperties';

export const adminHandlers = [
  // Dashboard overall stats
  http.get('*/api/admin/dashboard/stats/', () => {
    return HttpResponse.json({
      total_leads: MOCK_LEADS.length,
      today_leads: MOCK_LEADS.filter(l => l.created_at.startsWith('2026-07-28')).length,
      converted_properties: MOCK_PROPERTIES.length,
      active_operators: MOCK_USERS.filter(u => u.role.name === 'OPERATOR' && u.is_active).length,
      conversion_rate: 25.5,
    }, { status: 200 });
  }),

  // User management (CRUD)
  http.get('*/api/admin/users/', () => {
    return HttpResponse.json(MOCK_USERS, { status: 200 });
  }),

  http.post('*/api/admin/users/', async ({ request }) => {
    const newUser = await request.json();
    const createdUser = {
      id: MOCK_USERS.length + 1,
      ...newUser,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_USERS.push(createdUser);
    return HttpResponse.json(createdUser, { status: 201 });
  }),

  http.patch('*/api/admin/users/:id/', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const userIndex = MOCK_USERS.findIndex(u => u.id === Number(id));

    if (userIndex !== -1) {
      MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...body, updated_at: new Date().toISOString() };
      return HttpResponse.json(MOCK_USERS[userIndex], { status: 200 });
    }
    return HttpResponse.json({ message: 'کاربر یافت نشد.' }, { status: 404 });
  }),

  // Region & Location management
  http.get('*/api/admin/regions/', () => {
    return HttpResponse.json({
      provinces: MOCK_PROVINCES,
      cities: MOCK_CITIES,
      districts: MOCK_DISTRICTS,
      neighborhoods: MOCK_NEIGHBORHOODS,
    }, { status: 200 });
  }),

  // Scraper status & logs
  http.get('*/api/admin/scraper/status/', () => {
    return HttpResponse.json({
      is_running: true,
      last_run: '2026-07-28T14:00:00Z',
      total_scraped_today: 142,
      failed_jobs: 2,
      sources: [
        { name: 'Divar', status: 'ACTIVE', response_time_ms: 320 },
        { name: 'Sheypoor', status: 'ACTIVE', response_time_ms: 450 },
      ],
    }, { status: 200 });
  }),
];