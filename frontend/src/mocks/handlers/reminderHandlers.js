import { http, HttpResponse } from "msw";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { MOCK_REMINDERS } from "@/mocks/data/mockReminders";

const listUrl = API_ENDPOINTS.CRM.REMINDERS.LIST.url;
const createUrl = API_ENDPOINTS.CRM.REMINDERS.CREATE.url;

export const reminderHandlers = [
  http.get(listUrl, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("user");
    let results = [...MOCK_REMINDERS];
    if (userId) {
      results = results.filter((r) => r.user.id === Number(userId));
    }
    return HttpResponse.json(results, { status: 200 });
  }),

  http.post(createUrl, async ({ request }) => {
    const body = await request.json();
    const newReminder = {
      id: MOCK_REMINDERS.length + 1,
      ...body,
      status: "pending",
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_REMINDERS.push(newReminder);
    return HttpResponse.json(
      { message: "reminder created", reminder: newReminder },
      { status: 201 }
    );
  }),

  http.put(`${API_ENDPOINTS.CRM.REMINDERS.COMPLETE(0).url.replace(/0\/$/, "")}:id/`, ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_REMINDERS.findIndex((r) => r.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_REMINDERS[index].status = "done";
    MOCK_REMINDERS[index].completed_at = new Date().toISOString();
    MOCK_REMINDERS[index].updated_at = new Date().toISOString();
    return HttpResponse.json(
      { message: "reminder completed", reminder: MOCK_REMINDERS[index] },
      { status: 200 }
    );
  }),

  http.put(`${API_ENDPOINTS.CRM.REMINDERS.CANCEL(0).url.replace(/0\/$/, "")}:id/`, ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_REMINDERS.findIndex((r) => r.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_REMINDERS[index].status = "cancelled";
    MOCK_REMINDERS[index].updated_at = new Date().toISOString();
    return HttpResponse.json(
      { message: "reminder cancelled", reminder: MOCK_REMINDERS[index] },
      { status: 200 }
    );
  }),
];