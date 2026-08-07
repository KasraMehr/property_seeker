import { http, HttpResponse } from "msw";
import { MOCK_REMINDERS } from "@/mocks/data/mockReminders";

function paginate(array, { page = 1, pageSize = 25 }) {
  const count = array.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    count,
    next: end < count ? `?page=${page + 1}&page_size=${pageSize}` : null,
    previous: page > 1 ? `?page=${page - 1}&page_size=${pageSize}` : null,
    results: array.slice(start, end),
  };
}

export const reminderHandlers = [
  // ─── LIST (GET /api/crm/reminders/) ───
  http.get("*/api/crm/reminders/", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("page_size")) || 25;
    const userId = url.searchParams.get("user");
    const status = url.searchParams.get("status");
    const type = url.searchParams.get("type");
    const agencyId = url.searchParams.get("agency");

    let results = [...MOCK_REMINDERS];

    if (userId) {
      results = results.filter((r) => r.user?.id === Number(userId));
    }
    if (status) {
      const statuses = status.split(",");
      results = results.filter((r) => statuses.includes(r.status));
    }
    if (type) {
      results = results.filter((r) => r.type === type);
    }
    if (agencyId) {
      results = results.filter((r) => r.agency?.id === Number(agencyId));
    }

    return HttpResponse.json(paginate(results, { page, pageSize }), { status: 200 });
  }),

  // ─── DETAIL (GET /api/crm/reminders/:id/) ───
  http.get("*/api/crm/reminders/:id/", ({ params }) => {
    const id = Number(params.id);
    const reminder = MOCK_REMINDERS.find((r) => r.id === id);
    if (!reminder) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(reminder, { status: 200 });
  }),

  // ─── CREATE (POST /api/crm/reminders/create/) ───
  http.post("*/api/crm/reminders/create/", async ({ request }) => {
    const body = await request.json();
    const newReminder = {
      id: MOCK_REMINDERS.length + 1,
      ...body,
      status: body.status || "pending",
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_REMINDERS.push(newReminder);
    return HttpResponse.json(newReminder, { status: 201 });
  }),

  // ─── UPDATE (PUT /api/crm/reminders/:id/) ───
  http.put("*/api/crm/reminders/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_REMINDERS.findIndex((r) => r.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    MOCK_REMINDERS[index] = {
      ...MOCK_REMINDERS[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(MOCK_REMINDERS[index], { status: 200 });
  }),

  // ─── COMPLETE (PUT /api/crm/reminders/:id/complete/) ───
  http.put("*/api/crm/reminders/:id/complete/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_REMINDERS.findIndex((r) => r.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_REMINDERS[index].status = "done";
    MOCK_REMINDERS[index].completed_at = new Date().toISOString();
    MOCK_REMINDERS[index].updated_at = new Date().toISOString();
    return HttpResponse.json(MOCK_REMINDERS[index], { status: 200 });
  }),

  // ─── CANCEL (PUT /api/crm/reminders/:id/cancel/) ───
  http.put("*/api/crm/reminders/:id/cancel/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_REMINDERS.findIndex((r) => r.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_REMINDERS[index].status = "canceled";
    MOCK_REMINDERS[index].updated_at = new Date().toISOString();
    return HttpResponse.json(MOCK_REMINDERS[index], { status: 200 });
  }),

    //  DELETE 
  http.delete("*/api/crm/reminders/:id/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_REMINDERS.findIndex((r) => r.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_REMINDERS.splice(index, 1);
    return HttpResponse.json({ detail: "deleted" }, { status: 204 });
  }),
];