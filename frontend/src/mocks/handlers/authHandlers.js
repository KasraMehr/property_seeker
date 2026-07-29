import { http, HttpResponse } from "msw";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { MOCK_USERS } from "@/mocks/data/mockUsers";

const loginUrl = API_ENDPOINTS.AUTH.LOGIN.url;
const logoutUrl = API_ENDPOINTS.AUTH.LOGOUT.url;
const refreshUrl = API_ENDPOINTS.AUTH.REFRESH.url;
const verifyUrl = API_ENDPOINTS.AUTH.VERIFY.url;

export const authHandlers = [
  http.post(loginUrl, async ({ request }) => {
    const body = await request.json();
    const user = MOCK_USERS.find((u) => u.phone === body.phone);
    if (!user) {
      return HttpResponse.json(
        { message: "phone or password is incorrect" },
        { status: 401 }
      );
    }
    return HttpResponse.json(
      { message: "login successful", user },
      { status: 200 }
    );
  }),

  http.post(logoutUrl, () => {
    return HttpResponse.json(
      { message: "logout successful" },
      { status: 200 }
    );
  }),

  http.post(refreshUrl, () => {
    return HttpResponse.json(
      { message: "token refreshed" },
      { status: 200 }
    );
  }),

  http.get(verifyUrl, () => {
    return HttpResponse.json(
      { user: MOCK_USERS[0] },
      { status: 200 }
    );
  }),
];