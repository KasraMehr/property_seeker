import { http, HttpResponse } from "msw";
import { MOCK_CALL_LOGS } from "@/mocks/data/mockCallLogs";

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

export const callHandlers = [
  // ─── LIST + CREATE (GET/POST /api/calls/) ───
  http.get("*/api/calls/", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("page_size")) || 25;
    const listingId = url.searchParams.get("listing");
    const customerId = url.searchParams.get("customer");
    const handledBy = url.searchParams.get("handled_by");
    const result = url.searchParams.get("result");
    const callType = url.searchParams.get("call_type");

    let results = [...MOCK_CALL_LOGS];

    if (listingId) {
      results = results.filter((c) => c.listing?.id === Number(listingId));
    }
    if (customerId) {
      results = results.filter((c) => c.customer?.id === Number(customerId));
    }
    if (handledBy) {
      results = results.filter((c) => c.handled_by?.id === Number(handledBy));
    }
    if (result) {
      results = results.filter((c) => c.result === result);
    }
    if (callType) {
      results = results.filter((c) => c.call_type === callType);
    }

    return HttpResponse.json(paginate(results, { page, pageSize }), { status: 200 });
  }),

  http.post("*/api/calls/", async ({ request }) => {
    const body = await request.json();
    const newCall = {
      id: MOCK_CALL_LOGS.length + 1,
      ...body,
      follow_up_done: body.follow_up_done ?? false,
      is_deleted: false,
      created_at: new Date().toISOString(),
    };
    MOCK_CALL_LOGS.push(newCall);
    return HttpResponse.json(newCall, { status: 201 });
  }),

  // ─── DETAIL (GET /api/calls/:id/) ───
  http.get("*/api/calls/:id/", ({ params }) => {
    const id = Number(params.id);
    const call = MOCK_CALL_LOGS.find((c) => c.id === id);
    if (!call) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(call, { status: 200 });
  }),
];