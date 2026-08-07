import { http, HttpResponse } from "msw";
import { MOCK_PROPERTIES, MOCK_PROPERTIES_LIST } from "@/mocks/data/mockProperties";

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
  // ─── LIST (GET /api/property/list) ───
  // Returns MOCK_PROPERTIES_LIST to match PropertyListSerializer
  http.get("*/api/property/list", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("page_size")) || 25;
    const status = url.searchParams.get("status");
    const dealType = url.searchParams.get("deal_type");
    const ownerId = url.searchParams.get("owner");
    const agentId = url.searchParams.get("agent");
    const search = url.searchParams.get("search");

    let results = [...MOCK_PROPERTIES_LIST];

    if (status) {
      const statuses = status.split(",");
      results = results.filter((p) => statuses.includes(p.status));
    }
    if (dealType) {
      results = results.filter((p) => p.deal_type === dealType);
    }
    if (ownerId) {
      // For mock filtering by owner ID, we need to cross-reference MOCK_PROPERTIES
      results = results.filter((p, idx) => {
        const full = MOCK_PROPERTIES[idx];
        return full?.owner?.id === Number(ownerId);
      });
    }
    if (agentId) {
      results = results.filter((p, idx) => {
        const full = MOCK_PROPERTIES[idx];
        return full?.agent?.id === Number(agentId);
      });
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.property_code?.toLowerCase().includes(q)
      );
    }

    return HttpResponse.json(paginate(results, { page, pageSize }), { status: 200 });
  }),

  // ─── DETAIL (GET /api/property/detail/:id) ───
  // Returns full MOCK_PROPERTIES object to match PropertyDetailSerializer
  http.get("*/api/property/detail/:id", ({ params }) => {
    const id = Number(params.id);
    const property = MOCK_PROPERTIES.find((p) => p.id === id);
    if (!property) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(property, { status: 200 });
  }),

  // ─── CREATE (POST /api/property/create) ───
  http.post("*/api/property/create", async ({ request }) => {
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
    // Also push to list array
    MOCK_PROPERTIES_LIST.push({
      id: newProperty.id,
      agency: newProperty.agency?.id ?? newProperty.agency,
      property_code: newProperty.property_code,
      title: newProperty.title,
      owner: newProperty.owner?.full_name ?? newProperty.owner,
      agent: newProperty.agent?.full_name ?? newProperty.agent,
      created_by: newProperty.create_by?.full_name ?? newProperty.create_by,
      city: newProperty.address?.full_text?.split("،")[1]?.trim() || "کرج",
      property_type: newProperty.property_type,
      deal_type: newProperty.deal_type,
      area: newProperty.area,
      sale_price: newProperty.sale_price,
      monthly_rent: newProperty.monthly_rent,
      status: newProperty.status,
    });
    return HttpResponse.json(newProperty, { status: 201 });
  }),

  // ─── UPDATE (PUT /api/property/update/:id) ───
  http.put("*/api/property/update/:id", async ({ params, request }) => {
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
    // Sync list array
    MOCK_PROPERTIES_LIST[index] = {
      ...MOCK_PROPERTIES_LIST[index],
      property_code: MOCK_PROPERTIES[index].property_code,
      title: MOCK_PROPERTIES[index].title,
      owner: MOCK_PROPERTIES[index].owner?.full_name ?? MOCK_PROPERTIES[index].owner,
      agent: MOCK_PROPERTIES[index].agent?.full_name ?? MOCK_PROPERTIES[index].agent,
      city: MOCK_PROPERTIES[index].address?.full_text?.split("،")[1]?.trim() || "کرج",
      property_type: MOCK_PROPERTIES[index].property_type,
      deal_type: MOCK_PROPERTIES[index].deal_type,
      area: MOCK_PROPERTIES[index].area,
      sale_price: MOCK_PROPERTIES[index].sale_price,
      monthly_rent: MOCK_PROPERTIES[index].monthly_rent,
      status: MOCK_PROPERTIES[index].status,
    };
    return HttpResponse.json(MOCK_PROPERTIES[index], { status: 200 });
  }),

  // ─── DELETE (DELETE /api/property/delete/:id) ───
  http.delete("*/api/property/delete/:id", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_PROPERTIES.findIndex((p) => p.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_PROPERTIES.splice(index, 1);
    MOCK_PROPERTIES_LIST.splice(index, 1);
    return HttpResponse.json({ detail: "deleted" }, { status: 204 });
  }),

  // ─── BULK CHANGE STATUS (PUT /api/property/bulk-change-status) ───
  http.put("*/api/property/bulk-change-status", async ({ request }) => {
    const body = await request.json();
    const { ids, status, note } = body;
    ids.forEach((id) => {
      const idx = MOCK_PROPERTIES.findIndex((p) => p.id === id);
      if (idx !== -1) {
        MOCK_PROPERTIES[idx].status = status;
        MOCK_PROPERTIES[idx].updated_at = new Date().toISOString();
        MOCK_PROPERTIES_LIST[idx].status = status;
      }
    });
    return HttpResponse.json({ updated: ids.length, status, note }, { status: 200 });
  }),

  // ─── BULK ASSIGN AGENT (PUT /api/property/bulk-assign-agent) ───
  http.put("*/api/property/bulk-assign-agent", async ({ request }) => {
    const body = await request.json();
    const { ids, agent_id, note } = body;
    ids.forEach((id) => {
      const idx = MOCK_PROPERTIES.findIndex((p) => p.id === id);
      if (idx !== -1) {
        MOCK_PROPERTIES[idx].agent = { id: agent_id };
        MOCK_PROPERTIES[idx].updated_at = new Date().toISOString();
        MOCK_PROPERTIES_LIST[idx].agent = MOCK_PROPERTIES[idx].agent?.full_name || String(agent_id);
      }
    });
    return HttpResponse.json({ updated: ids.length, agent_id, note }, { status: 200 });
  }),
];