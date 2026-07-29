import { http, HttpResponse } from "msw";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { MOCK_USERS } from "@/mocks/data/mockUsers";

const listUrl = API_ENDPOINTS.ACCOUNTS.USERS.LIST.url;
const createUrl = API_ENDPOINTS.ACCOUNTS.USERS.CREATE.url;

export const userHandlers = [
  http.get(listUrl, () => {
    return HttpResponse.json(MOCK_USERS, { status: 200 });
  }),

  http.get(`${API_ENDPOINTS.ACCOUNTS.USERS.DETAIL(0).url.replace(/0\/$/, "")}:id/`, ({ params }) => {
    const id = Number(params.id);
    const user = MOCK_USERS.find((u) => u.id === id);
    if (!user) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(user, { status: 200 });
  }),

  http.post(createUrl, async ({ request }) => {
    const body = await request.json();
    const newUser = {
      id: MOCK_USERS.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_USERS.push(newUser);
    return HttpResponse.json(
      { message: "user created", user: newUser },
      { status: 201 }
    );
  }),

  http.put(`${API_ENDPOINTS.ACCOUNTS.USERS.UPDATE(0).url.replace(/0\/$/, "")}:id/`, async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_USERS.findIndex((u) => u.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    MOCK_USERS[index] = {
      ...MOCK_USERS[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(
      { message: "user updated", user: MOCK_USERS[index] },
      { status: 200 }
    );
  }),

  http.delete(`${API_ENDPOINTS.ACCOUNTS.USERS.DELETE(0).url.replace(/0\/$/, "")}:id/`, ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_USERS.findIndex((u) => u.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_USERS.splice(index, 1);
    return HttpResponse.json(
      { message: "user deleted" },
      { status: 204 }
    );
  }),
];