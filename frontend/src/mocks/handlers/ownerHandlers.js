import { http, HttpResponse } from "msw";
import { MOCK_OWNERS } from "@/mocks/data/mockOwners";

export const ownerHandlers = [
  http.get("*/api/owner/list/", () => {
    return HttpResponse.json(MOCK_OWNERS, { status: 200 });
  }),

  http.get("*/api/owner/detail/:id/", ({ params }) => {
    const id = Number(params.id);
    const owner = MOCK_OWNERS.find((o) => o.id === id);
    if (!owner) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(owner, { status: 200 });
  }),

  http.post("*/api/owner/create/", async ({ request }) => {
    const body = await request.json();
    const newOwner = {
      id: MOCK_OWNERS.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_OWNERS.push(newOwner);
    return HttpResponse.json(
      { message: "owner created", owner: newOwner },
      { status: 201 }
    );
  }),

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
    return HttpResponse.json(
      { message: "owner updated", owner: MOCK_OWNERS[index] },
      { status: 200 }
    );
  }),

  http.delete("*/api/owner/delete/:id/", ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_OWNERS.findIndex((o) => o.id === id);
    if (index === -1) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    MOCK_OWNERS.splice(index, 1);
    return HttpResponse.json(
      { message: "owner deleted" },
      { status: 204 }
    );
  }),
];