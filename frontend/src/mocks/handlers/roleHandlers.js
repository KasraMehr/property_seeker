import { http, HttpResponse } from "msw";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { MOCK_ROLES } from "@/mocks/data/mockRoles";

const listUrl = API_ENDPOINTS.ACCOUNTS.ROLES.LIST.url;
const createUrl = API_ENDPOINTS.ACCOUNTS.ROLES.CREATE.url;

const rolesArray = Object.values(MOCK_ROLES);

export const roleHandlers = [
  http.get(listUrl, () => {
    return HttpResponse.json(rolesArray, { status: 200 });
  }),

  http.get(`${API_ENDPOINTS.ACCOUNTS.ROLES.DETAIL(0).url.replace(/0\/$/, "")}:id/`, ({ params }) => {
    const id = Number(params.id);
    const role = rolesArray.find((r) => r.id === id);
    if (!role) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(role, { status: 200 });
  }),

  http.post(createUrl, async ({ request }) => {
    const body = await request.json();
    const newRole = {
      id: rolesArray.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    rolesArray.push(newRole);
    return HttpResponse.json(
      { message: "role created", role: newRole },
      { status: 201 }
    );
  }),

  http.put(`${API_ENDPOINTS.ACCOUNTS.ROLES.UPDATE(0).url.replace(/0\/$/, "")}:id/`, async ({ params, request }) => {
    const id = Number(params.id);
    const index = rolesArray.findIndex((r) => r.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    rolesArray[index] = {
      ...rolesArray[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(
      { message: "role updated", role: rolesArray[index] },
      { status: 200 }
    );
  }),
];