import { http, HttpResponse } from "msw";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { MOCK_PROPERTIES } from "@/mocks/data/mockProperties";

const listUrl = API_ENDPOINTS.PROPERTIES.LIST.url;
const createUrl = API_ENDPOINTS.PROPERTIES.CREATE.url;
const searchUrl = API_ENDPOINTS.PROPERTIES.SEARCH.url;

export const propertyHandlers = [
  http.get(listUrl, () => {
    return HttpResponse.json(MOCK_PROPERTIES, { status: 200 });
  }),

  http.get(`${listUrl}:id/`, ({ params }) => {
    const id = Number(params.id);
    const property = MOCK_PROPERTIES.find((p) => p.id === id);
    if (!property) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(property, { status: 200 });
  }),

  http.get(`${API_ENDPOINTS.PROPERTIES.DETAIL(0).url.replace(/0\/$/, "")}:id/`, ({ params }) => {
    const id = Number(params.id);
    const property = MOCK_PROPERTIES.find((p) => p.id === id);
    if (!property) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(property, { status: 200 });
  }),

  http.post(createUrl, async ({ request }) => {
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

  http.put(`${API_ENDPOINTS.PROPERTIES.UPDATE(0).url.replace(/0\/$/, "")}:id/`, async ({ params, request }) => {
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

  http.delete(`${API_ENDPOINTS.PROPERTIES.DELETE(0).url.replace(/0\/$/, "")}:id/`, ({ params }) => {
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

  http.get(searchUrl, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.toLowerCase() || "";
    const results = MOCK_PROPERTIES.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.property_code.toLowerCase().includes(q)
    );
    return HttpResponse.json(results, { status: 200 });
  }),

  http.get(`${API_ENDPOINTS.PROPERTIES.BY_OWNER(0).url.replace(/0\/$/, "")}:ownerId/`, ({ params }) => {
    const ownerId = Number(params.ownerId);
    const results = MOCK_PROPERTIES.filter((p) => p.owner.id === ownerId);
    return HttpResponse.json(results, { status: 200 });
  }),

  http.get(`${API_ENDPOINTS.PROPERTIES.BY_AGENT(0).url.replace(/0\/$/, "")}:agentId/`, ({ params }) => {
    const agentId = Number(params.agentId);
    const results = MOCK_PROPERTIES.filter((p) => p.agent.id === agentId);
    return HttpResponse.json(results, { status: 200 });
  }),

  http.get(`${API_ENDPOINTS.PROPERTIES.BY_STATUS("").url.replace(/\/$/, "")}:status/`, ({ params }) => {
    const status = params.status;
    const results = MOCK_PROPERTIES.filter((p) => p.status === status);
    return HttpResponse.json(results, { status: 200 });
  }),
];