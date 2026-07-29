import { http, HttpResponse } from "msw";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { MOCK_CALL_LOGS } from "@/mocks/data/mockCallLogs";

const listUrl = API_ENDPOINTS.CRM.CALLS.LIST.url;
const createUrl = API_ENDPOINTS.CRM.CALLS.CREATE.url;

export const callHandlers = [
  http.get(listUrl, ({ request }) => {
    const url = new URL(request.url);
    const listingId = url.searchParams.get("listing");
    let results = [...MOCK_CALL_LOGS];
    if (listingId) {
      results = results.filter((c) => c.listing?.id === Number(listingId));
    }
    return HttpResponse.json(results, { status: 200 });
  }),

  http.post(createUrl, async ({ request }) => {
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