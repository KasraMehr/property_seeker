import { http, HttpResponse } from "msw";
import { MOCK_ROLES } from "@/mocks/data/mockRoles";

const rolesArray = Object.values(MOCK_ROLES);

export const roleHandlers = [
  // ─── LIST (GET /api/accounts/roles/) ───
  http.get("*/api/accounts/roles/", () => {
    return HttpResponse.json(rolesArray, { status: 200 });
  }),

  // ─── DETAIL (GET /api/accounts/roles/:id/) ───
  http.get("*/api/accounts/roles/:id/", ({ params }) => {
    const id = Number(params.id);
    const role = rolesArray.find((r) => r.id === id);
    if (!role) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(role, { status: 200 });
  }),

  // ─── CREATE (POST /api/accounts/roles/) ───
  http.post("*/api/accounts/roles/", async ({ request }) => {
    const body = await request.json();
    const newRole = {
      id: rolesArray.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    rolesArray.push(newRole);
    return HttpResponse.json(newRole, { status: 201 });
  }),

  // ─── UPDATE (PUT /api/accounts/roles/:id/) ───
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
    return HttpResponse.json(rolesArray[index], { status: 200 });
  }),

  // ─── DELETE (DELETE /api/accounts/roles/:id/) ───
  http.delete("*/api/accounts/roles/:id/", ({ params }) => {
    const id = Number(params.id);
    const index = rolesArray.findIndex((r) => r.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    rolesArray.splice(index, 1);
    return HttpResponse.json({ detail: "deleted" }, { status: 204 });
  }),

  // ─── PERMISSIONS (GET /api/accounts/permissions/) ───
  http.get("*/api/accounts/permissions/", () => {
    return HttpResponse.json(
      [
        { codename: "add_property", name: "add property" },
        { codename: "change_property", name: "change property" },
        { codename: "delete_property", name: "delete property" },
        { codename: "view_property", name: "view property" },
        { codename: "add_user", name: "add user" },
        { codename: "change_user", name: "change user" },
        { codename: "delete_user", name: "delete user" },
        { codename: "view_user", name: "view user" },
        { codename: "add_owner", name: "add owner" },
        { codename: "change_owner", name: "change owner" },
        { codename: "view_owner", name: "view owner" },
        { codename: "add_call", name: "add call" },
        { codename: "change_call", name: "change call" },
        { codename: "view_call", name: "view call" },
        { codename: "add_followup", name: "add followup" },
        { codename: "change_followup", name: "change followup" },
        { codename: "view_followup", name: "view followup" },
        { codename: "view_scraper", name: "view scraper" },
        { codename: "manage_scraper", name: "manage scraper" },
        { codename: "manage_settings", name: "manage settings" },
        { codename: "view_reports", name: "view reports" },
        { codename: "view_dashboard", name: "view dashboard" },
        { codename: "export_data", name: "export data" },
        { codename: "import_data", name: "import data" },
      ],
      { status: 200 }
    );
  }),
];