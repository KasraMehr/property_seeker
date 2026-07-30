import { http, HttpResponse } from "msw";
import { MOCK_USERS } from "@/mocks/data/mockUsers";

export const userHandlers = [
  http.get("*/api/accounts/users/", () => {
    return HttpResponse.json(MOCK_USERS, { status: 200 });
  }),

  http.get("*/api/accounts/users/:id/", ({ params }) => {
    const id = Number(params.id);
    const user = MOCK_USERS.find((u) => u.id === id);
    if (!user) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(user, { status: 200 });
  }),

  http.post("*/api/accounts/users/", async ({ request }) => {
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

  http.put("*/api/accounts/users/:id/", async ({ params, request }) => {
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

  http.delete("*/api/accounts/users/:id/", ({ params }) => {
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