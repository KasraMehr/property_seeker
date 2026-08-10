import { http, HttpResponse } from "msw";
import { MOCK_USERS } from "@/mocks/data/mockUsers";
import { getRoleConfig } from "@/constants/roleConfig";

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

export const userHandlers = [
  http.get("*/api/accounts/users/", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("page_size")) || 25;
    const agencyId = url.searchParams.get("agency");
    const isActive = url.searchParams.get("is_active");
    const role = url.searchParams.get("role");
    const search = url.searchParams.get("search");

    let results = [...MOCK_USERS];

    /* ─── Filter: agency ─── */
    if (agencyId) {
      results = results.filter((u) => u.agency?.id === Number(agencyId));
    }

    /* ─── Filter: is_active ───     */
    if (isActive !== null && isActive !== undefined && isActive !== "") {
      const active = isActive === "true" || isActive === true;
      results = results.filter((u) => u.is_active === active);
    }

    /* ─── Filter: role    */
    if (role) {
      results = results.filter((u) => {
        const roleKey = getRoleConfig(u.role?.[0])?.key;
        return roleKey === role;
      });
    }

    /* ─── Filter: search ─── */
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(q) ||
          u.phone?.includes(q) ||
          u.national_id?.includes(q)
      );
    }

    return HttpResponse.json(paginate(results, { page, pageSize }), { status: 200 });
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
      is_active: body.is_active ?? true,
      is_staff: body.is_staff ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_USERS.push(newUser);
    return HttpResponse.json(newUser, { status: 201 });
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
    return HttpResponse.json(MOCK_USERS[index], { status: 200 });
  }),

  http.delete("*/api/accounts/users/:id/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_USERS.findIndex((u) => u.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_USERS.splice(index, 1);
    return HttpResponse.json({ detail: "deleted" }, { status: 204 });
  }),

    //  BULK CHANGE ROLE 
  http.put("*/api/accounts/users/bulk-change-role/", async ({ request }) => {
    const body = await request.json();
    const { ids, role } = body;
    ids.forEach((id) => {
      const idx = MOCK_USERS.findIndex((u) => u.id === id);
      if (idx !== -1) {
        MOCK_USERS[idx].role = [role];
        MOCK_USERS[idx].updated_at = new Date().toISOString();
      }
    });
    return HttpResponse.json({ updated: ids.length, role }, { status: 200 });
  }),

  //  BULK TOGGLE ACTIVE
  http.put("*/api/accounts/users/bulk-toggle-active/", async ({ request }) => {
    const body = await request.json();
    const { ids, is_active, note } = body;
    ids.forEach((id) => {
      const idx = MOCK_USERS.findIndex((u) => u.id === id);
      if (idx !== -1) {
        MOCK_USERS[idx].is_active = is_active;
        MOCK_USERS[idx].updated_at = new Date().toISOString();
      }
    });
    return HttpResponse.json({ updated: ids.length, is_active, note }, { status: 200 });
  }),
];