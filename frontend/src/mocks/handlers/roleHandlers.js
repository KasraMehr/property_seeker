import { http, HttpResponse } from "msw";
import { MOCK_ROLES } from "@/mocks/data/mockRoles";

const rolesArray = Object.values(MOCK_ROLES);

export const roleHandlers = [
  http.get("*/api/accounts/roles/", () => {
    return HttpResponse.json(rolesArray, { status: 200 });
  }),

  http.get("*/api/accounts/roles/:id/", ({ params }) => {
    const id = Number(params.id);
    const role = rolesArray.find((r) => r.id === id);
    if (!role) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(role, { status: 200 });
  }),

  http.post("*/api/accounts/roles/", async ({ request }) => {
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

  http.put("*/api/accounts/roles/:id/", async ({ params, request }) => {
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

  http.get("*/api/accounts/permissions/", () => {
    return HttpResponse.json(
      [
        { codename: "add_property", name: "add property" },
        { codename: "change_property", name: "change property" },
        { codename: "delete_property", name: "delete property" },
        { codename: "view_property", name: "view property" },
        { codename: "add_user", name: "add user" },
        { codename: "change_user", name: "change user" },
        { codename: "view_user", name: "view user" },
        { codename: "view_scraper", name: "view scraper" },
        { codename: "manage_settings", name: "manage settings" },
      ],
      { status: 200 }
    );
  }),
];