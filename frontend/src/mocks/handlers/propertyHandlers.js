import { http, HttpResponse } from "msw";
import { MOCK_PROPERTIES } from "@/mocks/data/mockProperties";

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

export const propertyHandlers = [
  // ─── LIST (GET /api/property/list/) ───
  http.get("*/api/property/list/", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("page_size")) || 25;
    const status = url.searchParams.get("status");
    const dealType = url.searchParams.get("deal_type");
    const ownerId = url.searchParams.get("owner");
    const agentId = url.searchParams.get("agent");
    const search = url.searchParams.get("search");

    let results = [...MOCK_PROPERTIES];

    if (status) {
      const statuses = status.split(",");
      results = results.filter((p) => statuses.includes(p.status));
    }
    if (dealType) {
      results = results.filter((p) => p.deal_type === dealType);
    }
    if (ownerId) {
      results = results.filter((p) => p.owner?.id === Number(ownerId));
    }
    if (agentId) {
      results = results.filter((p) => p.agent?.id === Number(agentId));
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.property_code?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    return HttpResponse.json(paginate(results, { page, pageSize }), { status: 200 });
  }),

  // ─── DETAIL (GET /api/property/detail/:id/) ───
  http.get("*/api/property/detail/:id/", ({ params }) => {
    const id = Number(params.id);
    const property = MOCK_PROPERTIES.find((p) => p.id === id);
    if (!property) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(property, { status: 200 });
  }),

  // ─── CREATE (POST /api/property/create/) ───
  http.post("*/api/property/create/", async ({ request }) => {
    const body = await request.json();
    const newId = MOCK_PROPERTIES.length + 1;
    const year = new Date().getFullYear();
    const newProperty = {
      id: newId,
      property_code: body.property_code || `PR-${year}-${String(newId).padStart(6, "0")}`,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_PROPERTIES.push(newProperty);
    return HttpResponse.json(newProperty, { status: 201 });
  }),

  // ─── UPDATE (PUT /api/property/update/:id/) ───
  http.put("*/api/property/update/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const index = MOCK_PROPERTIES.findIndex((p) => p.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    const body = await request.json();
    MOCK_PROPERTIES[index] = {
      ...MOCK_PROPERTIES[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(MOCK_PROPERTIES[index], { status: 200 });
  }),

  // ─── DELETE (DELETE /api/property/delete/:id/) ───
  http.delete("*/api/property/delete/:id/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_PROPERTIES.findIndex((p) => p.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_PROPERTIES.splice(index, 1);
    return HttpResponse.json({ detail: "deleted" }, { status: 204 });
  }),

  // ─── SEARCH (GET /api/property/search/) ───
  http.get("*/api/property/search/", ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.toLowerCase() || "";
    const results = MOCK_PROPERTIES.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.property_code.toLowerCase().includes(q)
    );
    return HttpResponse.json(results, { status: 200 });
  }),

  // ─── BY OWNER (GET /api/property/owner/:ownerId/) ───
  http.get("*/api/property/owner/:ownerId/", ({ params }) => {
    const ownerId = Number(params.ownerId);
    const results = MOCK_PROPERTIES.filter((p) => p.owner.id === ownerId);
    return HttpResponse.json(results, { status: 200 });
  }),

  // ─── BY AGENT (GET /api/property/agent/:agentId/) ───
  http.get("*/api/property/agent/:agentId/", ({ params }) => {
    const agentId = Number(params.agentId);
    const results = MOCK_PROPERTIES.filter((p) => p.agent.id === agentId);
    return HttpResponse.json(results, { status: 200 });
  }),

  // ─── BY STATUS (GET /api/property/status/:status/) ───
  http.get("*/api/property/status/:status/", ({ params }) => {
    const status = params.status;
    const results = MOCK_PROPERTIES.filter((p) => p.status === status);
    return HttpResponse.json(results, { status: 200 });
  }),

    //  BULK CHANGE STATUS 
  http.put("*/api/property/bulk-change-status/", async ({ request }) => {
    const body = await request.json();
    const { ids, status, note } = body;
    ids.forEach((id) => {
      const idx = MOCK_PROPERTIES.findIndex((p) => p.id === id);
      if (idx !== -1) {
        MOCK_PROPERTIES[idx].status = status;
        MOCK_PROPERTIES[idx].updated_at = new Date().toISOString();
      }
    });
    return HttpResponse.json({ updated: ids.length, status, note }, { status: 200 });
  }),

  // NEW: BULK ASSIGN AGENT 
  http.put("*/api/property/bulk-assign-agent/", async ({ request }) => {
    const body = await request.json();
    const { ids, agent_id, note } = body;
    ids.forEach((id) => {
      const idx = MOCK_PROPERTIES.findIndex((p) => p.id === id);
      if (idx !== -1) {
        MOCK_PROPERTIES[idx].agent = { id: agent_id };
        MOCK_PROPERTIES[idx].updated_at = new Date().toISOString();
      }
    });
    return HttpResponse.json({ updated: ids.length, agent_id, note }, { status: 200 });
  }),
];