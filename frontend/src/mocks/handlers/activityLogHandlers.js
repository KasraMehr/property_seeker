import { http, HttpResponse } from "msw";
import { MOCK_ACTIVITY_LOGS } from "@/mocks/data/mockActivityLogs";

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

export const activityLogHandlers = [
  // ─── LIST (GET /api/audit/activity/list/) ───
  http.get("*/api/audit/activity/list/", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("page_size")) || 25;
    const action = url.searchParams.get("action");
    const entityType = url.searchParams.get("entity_type");
    const entityId = url.searchParams.get("entity_id");
    const requestId = url.searchParams.get("request_id");

    let results = [...MOCK_ACTIVITY_LOGS];

    if (action) {
      results = results.filter((l) => l.action === action);
    }
    if (entityType) {
      results = results.filter((l) => l.entity_type === entityType);
    }
    if (entityId) {
      results = results.filter((l) => String(l.entity_id) === entityId);
    }
    if (requestId) {
      results = results.filter((l) => String(l.request_id) === requestId);
    }

    return HttpResponse.json(paginate(results, { page, pageSize }), { status: 200 });
  }),

  // ─── DETAIL (GET /api/audit/activity/detail/:id/) ───
  http.get("*/api/audit/activity/detail/:id/", ({ params }) => {
    const id = Number(params.id);
    const log = MOCK_ACTIVITY_LOGS.find((l) => l.id === id);
    if (!log) {
      return HttpResponse.json({ detail: "not found" }, { status: 404 });
    }
    return HttpResponse.json(log, { status: 200 });
  }),
];