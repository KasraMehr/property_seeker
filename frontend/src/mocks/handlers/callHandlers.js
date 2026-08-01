import { http, HttpResponse } from "msw";
import { MOCK_CALL_LOGS } from "@/mocks/data/mockCallLogs";

export const callHandlers = [
  http.get("*/api/crm/calls/", ({ request }) => {
    const url = new URL(request.url);
    const listingId = url.searchParams.get("listing");
    let results = [...MOCK_CALL_LOGS];
    if (listingId) {
      results = results.filter((c) => c.listing?.id === Number(listingId));
    }
    return HttpResponse.json(results, { status: 200 });
  }),

  http.post("*/api/crm/calls/create/", async ({ request }) => {
    const body = await request.json();
    const newCall = {
      id: MOCK_CALL_LOGS.length + 1,
      ...body,
      created_at: new Date().toISOString(),
    };
    MOCK_CALL_LOGS.push(newCall);
    return HttpResponse.json(
      { message: "call logged", call: newCall },
      { status: 201 }
    );
  }),
];