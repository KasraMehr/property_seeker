import { http, HttpResponse } from "msw";
import { MOCK_PROPERTIES } from "@/mocks/data/mockProperties";

export const propertyHandlers = [
  http.get("*/api/property/list/", () => {
    return HttpResponse.json(MOCK_PROPERTIES, { status: 200 });
  }),

  http.get("*/api/property/detail/:id/", ({ params }) => {
    const id = Number(params.id);
    const property = MOCK_PROPERTIES.find((p) => p.id === id);
    if (!property) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(property, { status: 200 });
  }),

  http.post("*/api/property/create/", async ({ request }) => {
    const body = await request.json();
    const newId = MOCK_PROPERTIES.length + 1;
    const year = new Date().getFullYear();
    const newProperty = {
      id: newId,
      property_code: `PR-${year}-${String(newId).padStart(6, "0")}`,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_PROPERTIES.push(newProperty);
    return HttpResponse.json(
      { message: "property created", property: newProperty },
      { status: 201 }
    );
  }),

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
    return HttpResponse.json(
      { message: "property updated", property: MOCK_PROPERTIES[index] },
      { status: 200 }
    );
  }),

  http.delete("*/api/property/delete/:id/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_PROPERTIES.findIndex((p) => p.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_PROPERTIES.splice(index, 1);
    return HttpResponse.json(
      { message: "property deleted" },
      { status: 204 }
    );
  }),

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

  http.get("*/api/property/owner/:ownerId/", ({ params }) => {
    const ownerId = Number(params.ownerId);
    const results = MOCK_PROPERTIES.filter((p) => p.owner.id === ownerId);
    return HttpResponse.json(results, { status: 200 });
  }),

  http.get("*/api/property/agent/:agentId/", ({ params }) => {
    const agentId = Number(params.agentId);
    const results = MOCK_PROPERTIES.filter((p) => p.agent.id === agentId);
    return HttpResponse.json(results, { status: 200 });
  }),

  http.get("*/api/property/status/:status/", ({ params }) => {
    const status = params.status;
    const results = MOCK_PROPERTIES.filter((p) => p.status === status);
    return HttpResponse.json(results, { status: 200 });
  }),
];