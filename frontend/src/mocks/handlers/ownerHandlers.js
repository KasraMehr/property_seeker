import { http, HttpResponse } from "msw";
import { MOCK_OWNERS } from "@/mocks/data/mockOwners";

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

export const ownerHandlers = [
  // ─── LIST (GET /api/owner/list/) ───
  http.get("*/api/owner/list/", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("page_size")) || 25;
    const agencyId = url.searchParams.get("agency");
    const search = url.searchParams.get("search");

    let results = [...MOCK_OWNERS];
    if (agencyId) {
      results = results.filter((o) => o.agency?.id === Number(agencyId));
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (o) =>
          o.full_name?.toLowerCase().includes(q) ||
          o.phone?.includes(q) ||
          o.national_id?.includes(q)
      );
    }

    return HttpResponse.json(paginate(results, { page, pageSize }), { status: 200 });
  }),

  // ─── DETAIL (GET /api/owner/detail/:id/) ───
  http.get("*/api/owner/detail/:id/", ({ params }) => {
    const id = Number(params.id);
    const owner = MOCK_OWNERS.find((o) => o.id === id);
    if (!owner) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(owner, { status: 200 });
  }),

  // ─── CREATE (POST /api/owner/create/) ───
  http.post("*/api/owner/create/", async ({ request }) => {
    const body = await request.json();
    const newOwner = {
      id: MOCK_OWNERS.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_OWNERS.push(newOwner);
    return HttpResponse.json(newOwner, { status: 201 });
  }),

  // ─── UPDATE (PUT /api/owner/update/:id/) ───
  http.put("*/api/owner/update/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_OWNERS.findIndex((o) => o.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    MOCK_OWNERS[index] = {
      ...MOCK_OWNERS[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(MOCK_OWNERS[index], { status: 200 });
  }),

  // ─── DELETE (DELETE /api/owner/delete/:id/) ───
  http.delete("*/api/owner/delete/:id/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_OWNERS.findIndex((o) => o.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_OWNERS.splice(index, 1);
    return HttpResponse.json({ detail: "deleted" }, { status: 204 });
  }),
];