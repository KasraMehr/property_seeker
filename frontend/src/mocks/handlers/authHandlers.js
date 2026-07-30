import { http, HttpResponse } from "msw";
import { MOCK_USERS } from "@/mocks/data/mockUsers";

// track current logged in user for mock session
let currentMockUser = MOCK_USERS[0];

export const authHandlers = [
  http.post("*/api/accounts/login/", async ({ request }) => {
    const body = await request.json();
    const user = MOCK_USERS.find((u) => u.phone === body.phone);
    if (!user) {
      return HttpResponse.json(
        { message: "phone or password is incorrect" },
        { status: 401 }
      );
    }
    currentMockUser = user;
    return HttpResponse.json(
      { message: "login successful", user },
      { status: 200 }
    );
  }),

  http.post("*/api/accounts/logout/", () => {
    currentMockUser = MOCK_USERS[0];
    return HttpResponse.json(
      { message: "logout successful" },
      { status: 200 }
    );
  }),

  http.post("*/api/accounts/refresh/", () => {
    return HttpResponse.json(
      { message: "token refreshed" },
      { status: 200 }
    );
  }),

  http.get("*/api/accounts/verify/", () => {
    return HttpResponse.json(
      { user: currentMockUser },
      { status: 200 }
    );
  }),
];